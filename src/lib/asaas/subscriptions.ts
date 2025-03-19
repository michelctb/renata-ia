
import { asaasRequest } from "./networking";
import { SubscriptionData, SubscriptionResponse } from "./types";

// Create subscription for monthly plan
export async function createSubscription({ customer, plan }: SubscriptionData): Promise<SubscriptionResponse> {
  console.log("Creating subscription with customer ID:", customer);
  
  try {
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 1); // Start tomorrow
    
    const subscriptionData = {
      billingType: "CREDIT_CARD",
      cycle: "MONTHLY",
      customer,
      value: 14.9,
      nextDueDate: nextDueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      description: "Renata.ia - Plano Mensal"
    };
    
    console.log("Subscription data:", JSON.stringify(subscriptionData));
    
    const subscription = await asaasRequest<SubscriptionResponse>("/subscriptions", "POST", subscriptionData);
    console.log("Subscription created successfully:", subscription);
    return subscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}
