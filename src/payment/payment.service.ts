import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { DocumentRequest } from 'src/document-request/entities/document-request.entity';
import { Sequelize } from 'sequelize-typescript';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  private readonly logger = new Logger(PaymentService.name);

  private get documentRequestRepository() {
    return this.sequelize.getRepository(DocumentRequest);
  }

  constructor(
    private configService: ConfigService,
    private readonly sequelize: Sequelize,
    private readonly mailService: MailService,
  ) {
    const stripeSecret = this.configService.getOrThrow<string>('STRIPE_SECRET');
    this.stripe = new Stripe(stripeSecret);
  }

  private formatDocumentType(type: string): string {
    return type
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  async createCheckoutSession(
    amount: number,
    currency: string,
    documentId: string, // Product ID can be used for better data management
    quantity: number,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: `Test Product`, // You can customize the product name as needed
                // Additional product information can be added here
              },
              unit_amount: amount * 100, // Amount is in cents
            },
            quantity: quantity, // Specify the quantity of the product
          },
        ],
        mode: 'payment', // Set the mode to 'payment'
        success_url: `http://localhost:5173/dashboard`, // Redirect URL on success
        cancel_url: `http://localhost:4242/cancel.html`, // Redirect URL on cancellation
        metadata: {
          // Pass any additional data here, such as user ID
          // or product ID for handling in webhooks
          documentId: documentId,
        },
      });

      return session; // Return the created session
    } catch (error) {
      console.error('Error creating session:', error);
      throw new InternalServerErrorException(
        'Failed to create checkout session', // Handle errors gracefully
      );
    }
  }
  // payment_intent.succeeded
  async handleWebhook(event: Stripe.Event) {
    console.log('Received event &&&&&&&&&&&&&&&&&&&&&&&&&&&&&', event.type);
    switch (event.type) {
      case 'checkout.session.completed':
        this.logger.log('Checkout session completed:', event.data.object);
        const session = event.data.object as Stripe.Checkout.Session;
        const { payment_status, metadata } = session;

        const documentId = metadata?.documentId;

        if (payment_status === 'paid') {
          this.logger.log(`Payment successful for document: ${documentId}`);

          const request =
            await this.documentRequestRepository.findByPk(documentId);
          if (!request) {
            throw new BadRequestException(
              `Document request with ID #${documentId} not found.`,
            );
          }

          const documentTypeRaw = request.dataValues.documentType || 'document';
          const documentTypeFormatted =
            this.formatDocumentType(documentTypeRaw); // see helper below
          const userFullName =
            [request.dataValues.firstName, request.dataValues.lastName]
              .filter(Boolean)
              .join(' ') || 'Student';

          const subject = `Your ${documentTypeFormatted} is Now Available`;

          const emailBody = `
              <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
                <p>Dear ${userFullName},</p>
          
                <p>We are pleased to inform you that your <strong>${documentTypeFormatted}</strong> has been processed and is now available for download.</p>
          
                <p>You can securely access your document using the link below:</p>
          
                <p>
                  <a href="http://localhost:7000/uploads/recomandations/Transcript.pdf" style="color: #1a73e8; text-decoration: none; font-weight: bold;">
                    Download Your ${documentTypeFormatted}
                  </a>
                </p>
          
                <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
          
                <p>Best regards,<br/>The UniDoc Team</p>
              </div>
            `;

          await this.mailService.sendMail(
            request.dataValues.email,
            subject,
            emailBody,
          );

          await request.update({
            fileUrl:
              'http://localhost:7000/uploads/recomandations/Transcript.pdf',
            status: 'approved',
          });

          return request;
        }
        break;

      case 'checkout.session.expired':
        this.logger.log('Checkout session expired:', event.data.object);
        console.log('Checkout session expired:', event.data.object);
        // Handle session expiration (e.g., notify the user or update the database)
        break;

      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
        console.warn(`Unhandled event type ${event.type}`);
        break;
    }
  }
}
