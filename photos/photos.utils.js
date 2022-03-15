

// 💕이 함수는 caption 유무를 검증하지 않음!
// String 형태의 caption을 받아서, hashtag 배열을 리턴.
export const processHashtags = (caption) => {

  // 캡션을 파싱하고 
  const hashtags = caption.match(/#[\w]+/g) || []; // .match()는 해당없으면 null을 반환함. 그러므로 OR []를 붙여서 null대신 빈 배열로 반환시키는 것,.
  //해시태그를 받아오거나 생성
  return hashtags.map((hashtag) => ({
    where: { hashtag },
    create: { hashtag },
  }));
}
