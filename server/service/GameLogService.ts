import { PrismaClient } from '@prisma/client';
import { apiAddGameLog } from '../types/GameLogTypes';
import { broadcast } from '../controller/WebsocketController';
import {
  isValidDiceRollCommand,
  parseDiceExpression,
  stripPrefix,
} from '../utils/DiceRoller';

const prisma = new PrismaClient();

export const addLog = async (user: any, req: apiAddGameLog) => {
  // TODO Morph the message. For instance, if someone does an /r that resolves to a roll
  // However, we want the result of the roll, not the test of the request

  let message = req.logMessage;

  // Check for dice roll
  if (isValidDiceRollCommand(req.logMessage)) {
    const result = parseDiceExpression(req.logMessage);
    message = 'Rolled ' + stripPrefix(req.logMessage) + '\nResult = ' + result;
  }

  await prisma.gameLog.create({
    data: {
      userName: user?.username,
      logMessage: message,
    },
  });

  broadcast({ type: 'refresh_logs' });
};

export const getGameLogs = async (user: any) => {
  // TODO Order by id not great
  // Some form of context knowledge (which story, which location)
  // Per user filtering
  const messages = (
    await prisma.gameLog.findMany({
      orderBy: { id: 'desc' },
      take: 20,
    })
  ).reverse();

  const apiMessages = messages.map((de) => {
    return { userName: de.userName, logMessage: de.logMessage };
  });

  return apiMessages;
};
