import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const PORT = config.PORT;
async function main() {
    try {
        // await prisma.$connect();
        console.log("Database connected successfully")
        app.listen(PORT, () => {
            console.log("Server running on port " + PORT)
        })

    } catch (error) {
        console.log(error)
        // await prisma.$disconnect();
        process.exit(1);
    }
}

main();