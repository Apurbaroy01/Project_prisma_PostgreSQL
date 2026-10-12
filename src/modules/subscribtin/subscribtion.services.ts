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
            line_items:[
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

export const subscribtionServices = {
    createCheckOutSession
}