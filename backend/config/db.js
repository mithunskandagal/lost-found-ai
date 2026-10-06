import mongoose from "mongoose";
import dns from "dns/promises";
import net from "net";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "";

  try {
    console.log("Starting MongoDB connection test...");

    // Get the host part without displaying username/password
    const afterAt = uri.split("@")[1];

    if (!afterAt) {
      console.error("MongoDB URI does not contain a valid host.");
      process.exit(1);
    }

    const hostPart = afterAt.split("/")[0];

    // Handle mongodb+srv://
    if (uri.startsWith("mongodb+srv://")) {
      const srvHost = hostPart.split(":")[0];

      console.log("Testing DNS SRV:", srvHost);

      const records = await dns.resolveSrv(`_mongodb._tcp.${srvHost}`);

      console.log("DNS SRV working.");
      console.log(
        "MongoDB hosts found:",
        records.map((r) => `${r.name}:${r.port}`)
      );
    } 
    // Handle mongodb://
    else {
      const firstHost = hostPart.split(",")[0].split(":")[0];

      console.log("Testing DNS:", firstHost);

      const address = await dns.lookup(firstHost);

      console.log("DNS working.");
      console.log("Resolved IP:", address.address);

      console.log("Testing TCP connection to port 27017...");

      await new Promise((resolve, reject) => {
        const socket = net.createConnection(
          {
            host: firstHost,
            port: 27017,
            timeout: 10000
          },
          () => {
            console.log("TCP connection to MongoDB port 27017 working.");
            socket.destroy();
            resolve();
          }
        );

        socket.on("error", reject);

        socket.on("timeout", () => {
          socket.destroy();
          reject(new Error("TCP connection timed out"));
        });
      });
    }

    console.log("Now testing Mongoose connection...");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000
    });

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    process.exit(1);
  }
}