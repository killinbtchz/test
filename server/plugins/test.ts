export default defineNitroPlugin((nitroApp) => {                               
    nitroApp.router.use(`/messagestest`, defineEventHandler({
      handler(event) {
        console.log('Тестовый плагин')
        console.log(event)
        return "Messages"
      },
    }));
    });