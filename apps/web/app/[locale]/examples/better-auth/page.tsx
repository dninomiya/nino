import { currentSession } from "./session";

export default async function Page() {
  const session = await currentSession();

  return <p>ようこそ、{session.user.name}さん</p>;
}
