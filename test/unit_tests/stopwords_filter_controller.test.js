import { MongoMemoryServer } from 'mongodb-memory-server';
import MongooseClass from '../../utils/database'; // Replace with the path to your MongooseClass file
import public_channel_msg_model from '../../models/public_channel_msg'; // Replace with the path to your PublicChannelMsg model file
import Stopwords_filter from '../../utils/stopwords_filter';
import {jest} from '@jest/globals';

let mongoServer;

// Set up the in-memory MongoDB instance
beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start();
  const mongoUri = await mongoServer.getUri();
  await MongooseClass.connectTestDB(mongoUri);
});

// Clean up the in-memory MongoDB instance
afterAll(async () => {
  await MongooseClass.closeDB();
  await mongoServer.stop();
});

describe('filterStopWords', () => {
    test('1. filterStopWords should return a regex for valid search queries', () => {
      const query = 'example search query';
      const regex = Stopwords_filter.filterStopWords(query);
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.source).toEqual('search|query');
    });
  
    test('2. filterStopWords should return -1 for search queries with only stop words', () => {
      const query = 'in of the';
      const result = Stopwords_filter.filterStopWords(query);
      expect(result).toEqual(-1);
    });
  
    test('3. filterStopWords should return null for invalid search queries', () => {
      const query = '      ';
      const result = Stopwords_filter.filterStopWords(query);
      expect(result).toBeNull();
    });
  
    test('4. filterStopWords should return "status" for search queries with "status" keyword and flagstatus set to true', () => {
      const query = 'status update';
      const result = Stopwords_filter.filterStopWords(query, true);
      expect(result).toEqual('status');
    });
  
    test('5. filterStopWords should ignore case when filtering stop words', () => {
      const query = 'Example SEARCH Query';
      const regex = Stopwords_filter.filterStopWords(query);
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.source).toEqual('search|query');
    });
  });