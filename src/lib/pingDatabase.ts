import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function pingDatabase(): Promise<{ ok: boolean; error?: string }> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return { ok: false, error: "MONGODB_URI is not set" };
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      const db = await mongoose.connect(uri, {});
      connection.isConnected = db.connections[0].readyState;
    }
    await mongoose.connection.db.admin().command({ ping: 1 });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database ping failed";
    return { ok: false, error: message };
  }
}
