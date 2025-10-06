import { Controller, Post, Body, Headers, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Stripe } from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session') // Define the route for creating a checkout session
  async createCheckoutSession(
    @Body()
    body: CreatePaymentDto,
  ): Promise<Stripe.Checkout.Session> {
    const { amount, currency, documentId, quantity } = body; // Destructure the body to get the necessary parameters

    return this.paymentService.createCheckoutSession(
      amount,
      currency,
      documentId,
      quantity,
    ); // Call the service method to create the session
  }

  // @Post('webhook')
  // async handleStripeWebhook(
  //   @Req() req: Request,
  //   @Headers('stripe-signature') sig: string,
  // ) {
  //   console.log('Received webhook $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', req.body);
  //   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  //   let event: Stripe.Event;

  //   try {
  //     event = this.paymentService['stripe'].webhooks.constructEvent(
  //       // req.rawBody,
  //       req.body as Buffer,
  //       sig,
  //       endpointSecret,
  //     );
  //     console.log('Event of webhook $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', event);
  //   } catch (err) {
  //     console.log(`⚠️  Webhook signature verification failed.`, err.message);
  //     return { error: `Webhook Error: ${err.message}` };
  //   }
  //   await this.paymentService.handleWebhook(event);
  // }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!sig) {
      console.log('⚠️  No stripe-signature header found');
      return { error: 'No stripe-signature header found' };
    }

    let event: Stripe.Event;

    try {
      const rawBody = (req as any).rawBody;

      if (!rawBody) {
        throw new Error('Raw body not available');
      }

      event = this.paymentService['stripe'].webhooks.constructEvent(
        rawBody,
        sig,
        endpointSecret,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return { error: `Webhook Error: ${err.message}` };
    }

    // Handle the webhook event
    try {
      await this.paymentService.handleWebhook(event);
      return { received: true };
    } catch (err) {
      return { error: `Error handling webhook: ${err.message}` };
    }
  }
}
