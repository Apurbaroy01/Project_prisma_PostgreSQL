import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckOutSession = async (userid: string) => {
    const transacationResilt = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: userid
            },
            include: {
                subscribtion: true
            }
        })

        // old customer
        let stripeCustomerId = user.subscribtion?.stripeCustomerId

        if (!stripeCustomerId) {
            // new customer
            const castomer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id
                }
            })
            stripeCustomerId = castomer.id
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: config.STRIPE_PRICE_ID,
                    quantity: 1
                }
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            allowed_payment_method_types: ["card"],
            success_url: `${config.app_Url}/primium?success=true`,
            cancel_url: `${config.app_Url}/payment?canceled=true`,
            metadata: {
                userId: user.id
            }
        })

        return session.url
    })

    return transacationResilt
};

const handleWebhook = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.STRIPE_WEBHOOK_SECRET

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    );

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            console.log(event.data.object);


            break;
        case 'customer.subscription.updated':

            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;

        case 'customer.subscription.deleted':

            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`No event matched Unhandled event type ${event.type}.`);
            break;
    }

}

export const subscribtionServices = {
    createCheckOutSession,
    handleWebhook
}