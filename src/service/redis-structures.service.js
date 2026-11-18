import { redisClient } from "../web/redis.js";

const setString = async (key, value, ttlInSeconds = null) => {
  if (ttlInSeconds) {
    return redisClient.set(key, value, "EX", ttlInSeconds);
  }
  return redisClient.set(key, value);
};

const getString = async (key) => {
  return redisClient.get(key);
};

const incrString = async (key) => {
  return redisClient.incr(key);
};

const setHash = async (key, field, value) => {
  return redisClient.hset(key, field, value);
};

const setHashObject = async (key, obj) => {
  return redisClient.hset(key, obj);
};

const getHash = async (key, field) => {
  return redisClient.hget(key, field);
};

const getAllHash = async (key) => {
  return redisClient.hgetall(key);
};

const pushToList = async (key, ...values) => {
  return redisClient.rpush(key, ...values);
};

const popFromList = async (key) => {
  return redisClient.lpop(key);
};

const getListRange = async (key, start = 0, stop = -1) => {
  return redisClient.lrange(key, start, stop);
};

const addToSet = async (key, ...members) => {
  return redisClient.sadd(key, ...members);
};

const isMemberOfSet = async (key, member) => {
  const result = await redisClient.sismember(key, member);
  return result === 1;
};

const getSetMembers = async (key) => {
  return redisClient.smembers(key);
};

const removeFromSet = async (key, ...members) => {
  return redisClient.srem(key, ...members);
};

const addToSortedSet = async (key, score, member) => {
  return redisClient.zadd(key, score, member);
};

const getSortedSetRange = async (key, start = 0, stop = -1, withScores = false) => {
  if (withScores) {
    return redisClient.zrange(key, start, stop, "WITHSCORES");
  }
  return redisClient.zrange(key, start, stop);
};

const getSortedSetScore = async (key, member) => {
  return redisClient.zscore(key, member);
};

export default {
  setString,
  getString,
  incrString,
  setHash,
  setHashObject,
  getHash,
  getAllHash,
  pushToList,
  popFromList,
  getListRange,
  addToSet,
  isMemberOfSet,
  getSetMembers,
  removeFromSet,
  addToSortedSet,
  getSortedSetRange,
  getSortedSetScore,
};
