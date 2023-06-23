import path from 'path';
import { SECURE } from '../app/config/index.js';
export const __dirname = path.resolve();

export const removeDuplicates = (arr1, arr2) => {
  let combined = arr1.concat(arr2); // 두 배열을 결합

  // 각 객체를 문자열로 변환하고 중복을 제거
  let unique = Array.from(new Set(combined.map(JSON.stringify))).map(
    JSON.parse
  );

  return unique;
};

export const setToken = (res, accessToken, refreshToken) => {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: SECURE,
    // 예: secure: true (HTTPS 연결에서만 전송)
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: SECURE,
  });
};
