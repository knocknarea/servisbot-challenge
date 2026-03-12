import { BotServiceClient } from "@servisbot/bot-service-client";
import { QueryClient } from "@tanstack/react-query";

/**
 * Some critical context data for the Tanstack Router
 * this includes access to the tan stack query
 * and our own BotServiceClient
 *
 * @export
 * @interface RouterContext
 */
export interface RouterContext {
    queryClient: QueryClient,
    botService: BotServiceClient
}