import fetch from 'node-fetch';

export interface CFUserInfo {
  handle: string;
  about?: string;
}

export const verifyCFHandle = async (handle: string, expectedToken: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data: any = await response.json();

    if (data.status !== 'OK') return false;

    const userInfo = data.result[0];
    return userInfo.about && userInfo.about.includes(expectedToken);
  } catch (err) {
    console.error('CF Verification Error:', err);
    return false;
  }
};
