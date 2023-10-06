/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import fetch from 'node-fetch';
import { region } from './config';
import { ODataResponse, TweedekamerApiRequest } from './tweedekamer-api.types';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const tweedekamerApi = onCall<
  TweedekamerApiRequest,
  Promise<ODataResponse>
>({ region }, async ({ data }) => {
  const { queryUrl } = data;

  if (!queryUrl) {
    throw new HttpsError('failed-precondition', 'No query url found in body');
  }

  const response = await fetch(queryUrl)
    .then((response) => response.json() as Promise<ODataResponse>)
    .catch((error) => {
      logger.error(error);
      throw new HttpsError(
        'unavailable',
        'Could not fetch data from tweedekamer api',
      );
    });

  return response;
});
