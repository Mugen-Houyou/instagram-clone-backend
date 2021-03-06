

// ๐์ด ํจ์๋ caption ์ ๋ฌด๋ฅผ ๊ฒ์ฆํ์ง ์์!
// String ํํ์ caption์ ๋ฐ์์, hashtag ๋ฐฐ์ด์ ๋ฆฌํด.
export const procesafdssHashtags = (caption) => {

  // ์บก์์ ํ์ฑํ๊ณ  
  const hashtags = caption.match(/#[\w]+/g) || []; // .match()๋ ํด๋น์์ผ๋ฉด null์ ๋ฐํํจ. ๊ทธ๋ฌ๋ฏ๋ก OR []๋ฅผ ๋ถ์ฌ์ null๋์  ๋น ๋ฐฐ์ด๋ก ๋ฐํ์ํค๋ ๊ฒ,.
  //ํด์ํ๊ทธ๋ฅผ ๋ฐ์์ค๊ฑฐ๋ ์์ฑ
  return hashtags.map((hashtag) => ({
    where: { hashtag },
    create: { hashtag },
  }));
}
