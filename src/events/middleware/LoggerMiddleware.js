export const LoggerMiddleware = (eventType, data) => {
    console.log(`[Event] ${eventType}`, data);
    return data;
}; 