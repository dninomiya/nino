import { jwtVerify, SignJWT } from "jose";

const enc = new TextEncoder();
const secret = enc.encode(process.env.REGISTRY_JWT_SECRET!);

export async function issueRegistryJWT() {
  return new SignJWT({ scope: "registry:read" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("nino-registry")
    .setAudience("shadcn-registry")
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(secret);
}

export async function verifyRegistryJWT(token: string | null) {
  if (!token) {
    return null;
  }

  const { payload } = await jwtVerify(token, secret, {
    issuer: "nino-registry",
    audience: "shadcn-registry",
  });
  return payload; // exp も自動で検証される
}
