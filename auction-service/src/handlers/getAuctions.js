import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParse from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

/**
 * @param {object} event: Object that contains all information (params, query) about the event (http)
 * @param {object} context: Object that contains additonal information about the event (http)
 */

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;

  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();

    auctions = result.Items;
  } catch (error) {
    console.log(error);

    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middy(getAuctions)
  .use(httpJsonBodyParse())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
