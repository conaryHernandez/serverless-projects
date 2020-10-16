/**
 * @param {object} event: Object that contains all information (params, query) about the event (http)
 * @param {object} context: Object that contains additonal information about the event (http)
 */

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();

  const auction = {
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  };

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
