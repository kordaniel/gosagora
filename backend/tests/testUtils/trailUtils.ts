import { Sailboat, Trail, TrailModule, UserSailboats } from '../../src/models';
import boatUtils from './boatUtils';
import { generateIdFromTimestamp } from './clientHelpers';
import userUtils from './userUtils';

let trailNumber: number = 0;
let lat = -10.0 + Math.random() * 20.0;
let lon = -10.0 + Math.random() * 20.0;
let acc = 3.0 + Math.random() * 5.0;
let hdg = Math.random() * 360.0;
let vel = Math.random() * 5.0;
const baseDate = new Date();

const getTrailCreationAttributesObject = (sailboatId?: number): TrailModule.TrailCreationAttributesType => {
  trailNumber++;

  const obj: TrailModule.TrailCreationAttributesType = {
    name: `Test trail ${trailNumber}`,
    public: trailNumber % 2 === 0,
    description: `A short description of our test trail ${trailNumber}`,
  };

  if (sailboatId !== undefined) {
    obj.sailboatId = sailboatId;
  }

  return obj;
};

const getLoggedTrailPositionsAttributesArray = (length: number) => {
  return Array.from({ length }, (_, i) => {
    const timestamp = new Date(baseDate.getTime() + i * 100);
    const dir = Math.random() < 0.5 ? 1 : -1;
    lat += dir * 0.1;
    lon += dir * 0.1;
    acc = Math.max(acc + dir * 0.1, 1.5);
    hdg += dir * 0.1;
    hdg = (hdg + 360) % 360;
    vel = Math.max(vel + dir * 0.1, 0.1);
    return {
      clientId: generateIdFromTimestamp(timestamp.getTime()),
      timestamp, lat, lon, acc, hdg, vel
    };
  });
};

const getLoggedTrailPositionsArgumentsArray = (length: number = 5) => {
  return getLoggedTrailPositionsAttributesArray(length).map(
    attr => ({ ...attr, timestamp: attr.timestamp.toISOString() })
  );
};

const createTrails = async () => {
  const users = await Promise.all([
    userUtils.createSignedInUser(),
    userUtils.createSignedInUser()
  ]);
  const usersBoats: Array<{
    boats: { sailboat: Sailboat; userSailboats: UserSailboats | undefined; }[];
  }> = [{
    boats: [
      await boatUtils.createBoatForUser(users[0].user),
      await boatUtils.createBoatForUser(users[0].user),
    ]
  }, {
    boats: [
      await boatUtils.createBoatForUser(users[1].user),
    ]
  }];

  const trailCreationData = [
    getTrailCreationAttributesObject(usersBoats[0].boats[0].sailboat.id),
    getTrailCreationAttributesObject(usersBoats[0].boats[1].sailboat.id),
    getTrailCreationAttributesObject(usersBoats[1].boats[0].sailboat.id)
  ];

  const trails = await Promise.all([
    Trail.create({
      userId: users[0].user.id,
      ...trailCreationData[0],
      name: trailCreationData[0].name + '. First trail of first user',
    }),
    Trail.create({
      userId: users[0].user.id,
      ...trailCreationData[1],
      name: trailCreationData[1].name + '. Second trail of first user',
    }),
    Trail.create({
      userId: users[1].user.id,
      ...trailCreationData[2],
      name: trailCreationData[2].name + '. First trail of second user',
    }),
  ]);

  return trails.map((trail, i) => ({
    trail,
    user: users[i < 2 ? 0 : 1].user,
    userCredentials: users[i < 2 ? 0 : 1].credentials,
    boat: usersBoats[i < 2 ? 0 : 1].boats[i < 2 ? i : 0],
  }));
};

export default {
  createTrails,
  getLoggedTrailPositionsArgumentsArray,
  getLoggedTrailPositionsAttributesArray,
};
