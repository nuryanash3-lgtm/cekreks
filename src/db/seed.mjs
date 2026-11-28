import crypto from "node:crypto";
import { neonConfig, Pool } from "@neondatabase/serverless";

if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}

const DEFAULT_ADMIN_HASH =
  "82ab6bd3c6a845564920b5bfa00367e7:8484848b0a627eec7616a2a82fbc88aa8a83a3063f7f390986515003cb1518638df5ee16a9d82bcaa1faf33807f8a28f7f608d848cb6ad06e2e753cfc28c2806";
const DEFAULT_USER_HASH =
  "7402afd61468654354aacb8636da4de8:61fb195140e5d69014ac11ac8194bb67494cff4d17cef93b97838ec29114a955f27a45401d9f2f35cc996d1a142a7effd6477c6cff525cf75d3e8b97d90b7b0b";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

async function ensureSeedUser(client, user) {
  await client.query(
    `
      INSERT INTO users (
        name, email, password_hash, role, status,
        company_name, city, country, plan_name, token_balance
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (email) DO NOTHING
    `,
    [
      user.name,
      user.email,
      user.passwordHash,
      user.role,
      user.status,
      user.companyName,
      user.city,
      user.country,
      user.planName,
      user.tokenBalance,
    ]
  );

  const { rows } = await client.query(
    `SELECT id, email, role, token_balance FROM users WHERE email = $1 LIMIT 1`,
    [user.email]
  );
  if (rows.length === 0) {
    throw new Error(`Failed to resolve seeded user: ${user.email}`);
  }
  return rows[0];
}

async function ensureInitialTokenTransaction(client, userRow) {
  const { rows } = await client.query(
    `SELECT COUNT(*)::int AS count FROM token_transactions WHERE user_id = $1`,
    [userRow.id]
  );
  if (rows[0]?.count === 0) {
    await client.query(
      `
        INSERT INTO token_transactions (user_id, type, amount, balance_after, note)
        VALUES ($1, 'topup', $2, $3, 'Initial seed token balance')
      `,
      [userRow.id, userRow.token_balance, userRow.token_balance]
    );
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to run src/db/seed.mjs");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const seedUsers = [
      {
        name: "Admin Cekreks",
        email: "admin@cekreks.id",
        role: "admin",
        status: "active",
        planName: "Enterprise",
        tokenBalance: 5000,
        companyName: "Cekreks HQ",
        city: "Bandung",
        country: "Indonesia",
        passwordHash: process.env.AUTH_ADMIN_PASSWORD
          ? hashPassword(process.env.AUTH_ADMIN_PASSWORD)
          : DEFAULT_ADMIN_HASH,
      },
      {
        name: "Operator Event",
        email: "user@cekreks.id",
        role: "operator",
        status: "active",
        planName: "Pro",
        tokenBalance: 250,
        companyName: "CekreksID",
        city: "Bandung",
        country: "Indonesia",
        passwordHash: process.env.AUTH_USER_PASSWORD
          ? hashPassword(process.env.AUTH_USER_PASSWORD)
          : DEFAULT_USER_HASH,
      },
    ];

    const persistedUsers = [];
    for (const user of seedUsers) {
      const persisted = await ensureSeedUser(client, user);
      await ensureInitialTokenTransaction(client, persisted);
      persistedUsers.push(persisted);
    }

    const operatorUser = persistedUsers.find((u) => u.email === "user@cekreks.id");
    if (!operatorUser) {
      throw new Error("Operator seed user not found");
    }

    const seedEvents = [
      {
        code: "4S03UZ",
        title: "ARTBOOTH",
        eventDate: "2026-10-17",
        description: "Semua bisa mengekspresikan disini",
        isPublic: true,
      },
      {
        code: "K4X41Z",
        title: "Wedding Party",
        eventDate: "2026-11-07",
        description: "Wedding At Baros",
        isPublic: true,
      },
    ];

    for (const ev of seedEvents) {
      await client.query(
        `
          INSERT INTO events (owner_id, code, title, description, event_date, is_public)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (code) DO NOTHING
        `,
        [operatorUser.id, ev.code, ev.title, ev.description, ev.eventDate, ev.isPublic]
      );
    }

    await client.query("COMMIT");

    console.log("Seed completed successfully:");
    for (const u of persistedUsers) {
      console.log(`- User: ${u.email} (role=${u.role}, token_balance=${u.token_balance})`);
    }
    for (const ev of seedEvents) {
      console.log(`- Event: ${ev.code} (${ev.title})`);
    }
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Database seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
