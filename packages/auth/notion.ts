import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const NOTION_INVITE_DATABASE_ID = "24d1fc40c97580be9a71f36ac9037504";

export async function updateMemberStatusToKicking(npid: string) {
  const query = await notion.dataSources.query({
    data_source_id: NOTION_INVITE_DATABASE_ID,
    filter: {
      property: "NPID",
      title: {
        equals: npid,
      },
    },
  });

  const page = query.results[0];
  if (!page) {
    throw new Error("ページが見つかりません");
  }

  return notion.pages.update({
    page_id: page.id,
    properties: {
      ステータス: {
        status: {
          name: "退会処理中",
        },
      },
    },
  });
}
