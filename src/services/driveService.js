import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';
const APP_FOLDER_NAME = 'IslamicQadeem';

const getAccessToken = async (uid) => {
  const tokenDoc = await getDoc(doc(db, 'userTokens', uid));
  if (tokenDoc.exists()) {
    return tokenDoc.data().googleAccessToken;
  }
  return null;
};

const getOrCreateAppFolder = async (accessToken) => {
  const searchResponse = await fetch(
    `${DRIVE_API_BASE}/files?q=name='${APP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const searchData = await searchResponse.json();

  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  const createResponse = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: APP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  const folder = await createResponse.json();
  return folder.id;
};

export const uploadFileToDrive = async (uid, fileUri, fileName, mimeType) => {
  const accessToken = await getAccessToken(uid);
  if (!accessToken) {
    throw new Error('Google Drive not connected. Please sign in with Google.');
  }

  const folderId = await getOrCreateAppFolder(accessToken);

  const metadata = {
    name: fileName,
    parents: [folderId],
  };

  const response = await fetch(fileUri);
  const blob = await response.blob();

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob, fileName);

  const uploadResponse = await fetch(
    `${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file to Google Drive');
  }

  return await uploadResponse.json();
};

export const listDriveFiles = async (uid) => {
  const accessToken = await getAccessToken(uid);
  if (!accessToken) return [];

  const folderId = await getOrCreateAppFolder(accessToken);

  const response = await fetch(
    `${DRIVE_API_BASE}/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime)&orderBy=createdTime desc`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const data = await response.json();
  return data.files || [];
};

export const deleteDriveFile = async (uid, fileId) => {
  const accessToken = await getAccessToken(uid);
  if (!accessToken) throw new Error('Not authenticated with Google Drive');

  await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
