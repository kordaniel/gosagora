import { type NewRaceValuesType } from '../../src/models/race';
import { raceValuesToRaceArguments } from '../../src/schemas/race';

import { type RaceData } from '@common/types/rest_api';
import { RaceType } from '@common/types/race';


describe('Schemas/race', () => {

  describe('raceValuesToRaceArguments', () => {
    const existingRaceData: RaceData = {
      id: 1,
      name: 'race',
      type: RaceType.OneDesign,
      public: true,
      description: 'ABCDEF',
      email: null,
      url: 'https://test.race.net/',
      dateFrom: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
      dateTo: new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toISOString(),
      registrationOpenDate: new Date(new Date().getTime()).toISOString(),
      registrationCloseDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 2,
        displayName: 'raceCreatorName',
      },
    };

    it('returns null if no values have changed', () => {
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: existingRaceData.url ?? '',
        email: existingRaceData.email ?? '',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toBeNull();
    });

    it('returns changed name', () => {
      const newValues: NewRaceValuesType = {
        name: 'not a race',
        type: existingRaceData.type,
        url: existingRaceData.url ?? '',
        email: existingRaceData.email ?? '',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toStrictEqual({
        name: 'not a race',
      });
    });

    it('returns changed url', () => {
      expect(existingRaceData.url).not.toBeNull();
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: 'http://new.url.net',
        email: existingRaceData.email ?? '',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toStrictEqual({
        url: 'http://new.url.net'
      });
    });

    it('returns changed empty url as null', () => {
      expect(existingRaceData.url).not.toBeNull();
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: '',
        email: existingRaceData.email ?? '',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toStrictEqual({
        url: null
      });
    });

    it('returns changed email', () => {
      expect(existingRaceData.email).toBeNull();
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: existingRaceData.url ?? '',
        email: 'email@addres.com',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toStrictEqual({
        email: 'email@addres.com'
      });
    });

    it('returns changed description', () => {
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: existingRaceData.url ?? '',
        email: existingRaceData.email ?? '',
        description: 'this is a new and longer description',
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toStrictEqual({
        description: 'this is a new and longer description'
      });
    });

    it('returns all dates if dateFrom has changed', () => {
      const startDate = new Date(new Date(existingRaceData.dateFrom).getTime() + 24 * 60 * 60 * 1000);
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: existingRaceData.url ?? '',
        email: existingRaceData.email ?? '',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate,
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toStrictEqual({
        dateFrom: startDate.toISOString(),
        dateTo: existingRaceData.dateTo,
        registrationOpenDate: existingRaceData.registrationOpenDate,
        registrationCloseDate: existingRaceData.registrationCloseDate
      });
    });

    it('returns all dates if dateTo has changed', () => {
      const endDate = new Date(new Date(existingRaceData.dateTo).getTime() + 1);
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: existingRaceData.url ?? '',
        email: existingRaceData.email ?? '',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate,
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toStrictEqual({
        dateFrom: existingRaceData.dateFrom,
        dateTo: endDate.toISOString(),
        registrationOpenDate: existingRaceData.registrationOpenDate,
        registrationCloseDate: existingRaceData.registrationCloseDate
      });
    });

    it('returns all dates if registrationOpenDate has changed', () => {
      const registrationOpenDate = new Date(new Date(existingRaceData.registrationOpenDate).getTime() - 3 * 24 * 60 * 60 * 1000);
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: existingRaceData.url ?? '',
        email: existingRaceData.email ?? '',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: registrationOpenDate,
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toStrictEqual({
        dateFrom: existingRaceData.dateFrom,
        dateTo: existingRaceData.dateTo,
        registrationOpenDate: registrationOpenDate.toISOString(),
        registrationCloseDate: existingRaceData.registrationCloseDate
      });
    });

    it('returns all dates if registrationCloseDate has changed', () => {
      const registrationCloseDate = new Date(new Date(existingRaceData.registrationCloseDate).getTime() + 1);
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: existingRaceData.url ?? '',
        email: existingRaceData.email ?? '',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: registrationCloseDate,
        },
      };
      const result = raceValuesToRaceArguments(newValues, existingRaceData);
      expect(result).toStrictEqual({
        dateFrom: existingRaceData.dateFrom,
        dateTo: existingRaceData.dateTo,
        registrationOpenDate: existingRaceData.registrationOpenDate,
        registrationCloseDate: registrationCloseDate.toISOString()
      });
    });

    it('returns all values if no oldValues are given', () => {
      const newValues: NewRaceValuesType = {
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: existingRaceData.url ?? '',
        email: existingRaceData.email ?? '',
        description: existingRaceData.description,
        startEndDateRange: {
          startDate: new Date(existingRaceData.dateFrom),
          endDate: new Date(existingRaceData.dateTo),
        },
        registrationStartEndDateRange:{
          startDate: new Date(existingRaceData.registrationOpenDate),
          endDate: new Date(existingRaceData.registrationCloseDate),
        },
      };
      const result = raceValuesToRaceArguments(newValues);
      expect(result).toStrictEqual({
        name: existingRaceData.name,
        type: existingRaceData.type,
        url: existingRaceData.url,
        email: existingRaceData.email,
        description: existingRaceData.description,
        dateFrom: existingRaceData.dateFrom,
        dateTo: existingRaceData.dateTo,
        registrationOpenDate: existingRaceData.registrationOpenDate,
        registrationCloseDate: existingRaceData.registrationCloseDate,
      });

    });

  }); // raceValuesToRaceArguments

}); // Schemas/race
