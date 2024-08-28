# home-presence-detection
A hardware/software project utilizing millimeter wave radar to detect and monitor human presence in different rooms of a house.

install packages `npm install`
Run server `npx tsx watch ./server/server.ts`
Run sensor watcher `npx tsx watch ./src/repository.ts`



calculate db accumulation rate

12 + 30 + 8 + 15 + 4 = 69 
sample rate = 1 
69 * 60 * 60 * 24 = 5.961.600 bytes per day, 5.6MB