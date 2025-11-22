import { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表示",
  openGraph: {
    title: "特定商取引法に基づく表示",
  },
};

export default function Page() {
  return (
    <div className="container prose prose-table:text-sm prose-th:w-1/2 dark:prose-invert my-10">
      <h1>特定商取引法に基づく表示</h1>
      <table>
        <tbody>
          <tr>
            <th>事業者</th>
            <td>Deer, Inc</td>
          </tr>
          <tr>
            <th>住所</th>
            <td>〒160-0022 東京都 新宿区 新宿1-36-2 新宿第七葉山ビル3F</td>
          </tr>
          <tr>
            <th>メールアドレス</th>
            <td>
              <span>info@deer.co.jp</span>
            </td>
          </tr>
          <tr>
            <th>役務の対価</th>
            <td>各サービスの申込ページに表示</td>
          </tr>
          <tr>
            <th>対価以外に必要となる費用</th>
            <td>
              なし（但し、インターネット接続料金その他の電気通信回線の通信に関する費用及び通信機器はユーザーにて負担して頂きます）。
            </td>
          </tr>
          <tr>
            <th>代金の支払方法</th>
            <td>クレジットカード決済</td>
          </tr>
          <tr>
            <th>代金の支払時期</th>
            <td>各サービスの申込時に入力したクレジットカードに課金します。</td>
          </tr>
          <tr>
            <th>役務の提供時期</th>
            <td>即時</td>
          </tr>
          <tr>
            <th>キャンセル（返品・交換/返品特約）</th>
            <td>申込後のキャンセルはできません。</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
