# Work hours for FullstackOpen Project
| Date | Hours | What |
| ---- | ----: | ---- |
| 2025.04.07 | 0   | Initialize repository |
| 2025.04.07 | 0.5 | Initialize backend |
| 2025.04.08 | 1   | BACKEND: Configure environments, add logger and config |
| 2025.04.08 | 0.5 | BACKEND: Add basic error handling, modularize app |
| 2025.04.09 | 2   | BACKEND: Add & configure jest, supertest and Postgres container for tests. Implement a few tests |
| 2025.04.10 | 0   | Configure github repo. Prevent pushes to main and require a pull request before merging. Add png to git lfs |
| 2025.04.10 | 3   | FRONTEND: Initialize expo-react-native app, create basic structure, components. Implement themecontext for light/dark styling |
| 2025.04.11 | 1   | FRONTEND: Configure eslint |
| 2025.04.11 | 3   | FRONTEND: Add react-native-paper, react-native-vector-icons. Setup light and dark themes, selected by Platform. Refactor themecontext to use react-native-paper context |
| 2025.04.11 | 0   | FRONTEND: Add theme to StyledText |
| 2025.04.11 | 0.5 | FRONTEND: Configure tsconfig |
| 2025.04.14 | 2.5 | BACKEND: Add CORS for development env. Improve error, response handling |
| 2025.04.15 | 0   | BACKEND: Allow CORS for unknown origins in dev env (android emulator) |
| 2025.04.15 | 5   | FRONTEND: Add env, config, axiosInstance, error handling and rendering, service status component with hook |
| 2025.04.15 | 0.5 | FRONTEND: Add DeveloperView that shows app status in dev env |
| 2025.04.16 | 2.5 | FRONTEND: Setup test framework. Unit testing works, testing components with testing-library/react-native does not. Fixed a few packages versions to be compatible with expo/react native-18.3 |
| 2025.04.17 | 1   | FRONTEND: Fix testing framework, unit- and component testing works, add more linting rules, reconfigure project/packages to be expo compatible |
| 2025.04.19 | 3   | FRONTEND: Add formik, yup, firebase packages. Add Form component |
| 2025.04.19 | 1   | FRONTEND: Add tests for Form Component |
| 2025.04.20 | 4   | FRONTEND: Add SignIn, SignUp page & Button, ErrorRenderer components. Update theme, stylize Form & extend StyledText. Refactored tests to accomodate themes |
| 2025.04.21 | 1   | BACKEND: Add sequelize, pg, firebase-admin packages, postgres container. Implement module for sequelize.
| 2025.04.23 | 2   | FRONTEND: Refactor Authentication page: Render sign in, sign up and sign out conditionally. Use firebase email/pass auth as backend |
| 2025.04.25 | 2   | BACKEND: Add umzug package. Configure sequelize migrations, add User model |
| 2025.04.25 | 3   | BACKEND: Add "/auth" router with signup, signin. Work on request parsing, errorhandling and responses (zod, strict typescript typing) |
| 2025.04.27 | 3   | Write README's, instructions, configure environments. Use different containers for backend dev and test envs with persisting storage |
| 2025.04.27 | 2   | BACKEND: Work on auth, types, errorhandling |
| 2025.04.27 | 1   | BACKEND: Fix npm scripts. Update README's. Switch bind->named volumes in docker compose. Add displayName field to User |
| 2025.04.28 | 2   | BACKEND: Write instructions for Firebase Local Emulator Suite and dev/test environments. Refactor firebase setup to account for different environments |
| 2025.04.29 | 3   | BACKEND: Configure, setup scripts, write instruction for Firebase Local Emulator. Spent too much time trying to configure FB emulator to exec npm-scripts with its command *emulators:exec "npm run.."*, with no success. So implemented a bash-script that uses npx to run tests. ts-node-dev does not work with the same setup so no bash-script for dev-env |
| 2025.04.30 | 2   | BACKEND: Add firebase (client, for tests), faker packages. Implement first test for "/auth" route, signup success case |
| 2025.05.03 | 1   | BACKEND: Firebase emulator configuration. Persistent, isolated storage for environments, update and add scripts and instructions |
| 2025.05.08 | 3   | SERVICE/BACKEND: Refactor auth logic => create all users trough backend, login trough frontend. FRONTEND: SignIn/Up implemented: useAuth hook, firebase, authService. Add firebaseConfig. Configure dev/test envs to use firebase local emulator |
| 2025.05.09 | 3   | BACKEND: Implement tests for signup, improve error handling/responses |
| 2025.05.09 | 1   | BACKEND: Trim all /auth arguments, store user email in lowercase. Add test for successful SignIn |
| 2025.05.09 | 1   | BACKEND: Implement SignIn tests, improve error handling/responses |
| 2025.05.10 | 0.5 | FRONTEND: Fix minor issues, stylize |
| 2025.05.12 | 1   | Setup typescript references, add common types for back- and frontends |
| 2025.05.13 | 0.5 | Configure linting, compilation, test coverage, sequelize logging |
| 2025.05.14 | 0.5 | FRONTEND: Add react-navigation |
| 2025.05.19 | 0.5 | FRONTEND: Add react-navigation/bottom-tabs |
| 2025.05.19 | 1   | FRONTEND: Move Sign In/Up/Out to profile |
| 2025.05.20 | 1   | BACKEND: Add, configure tsconfig-paths. Enables usage of common modules without first running separate tsc compilation |
| 2025.05.20 | 1   | BACKEND: Add model Race, migration |
| 2025.05.20 | 0   | BACKEND: Bugfix migrations race table column names, move requestParsers to routes/parsers |
| 2025.05.29 | 4   | BACKEND: Add route for race creation, initial tests that must be run sequentially with auth tests. Start work on user authorization |
| 2025.05.29 | 0.5 | BACKEND: Refactor all API routes tests into one testSuite that runs child test suites in sequential order |
| 2025.05.30 | 1.5 | BACKEND: Work on user authorization middleware. Test that user is authorized to create races |
| 2025.05.30 | 1   | BACKEND: Implement endpoint that returns all races, tests |
| 2025.06.12 | 2   | FRONTEND: Conf expo metro bundler to include common packages. Refactor pages to wrap content in SafeAreaView, extend theme to support this |
| 2025.06.17 | 2   | FRONTEND: Extend Form component with a Selection Picker |
| 2025.06.18 | 4   | FRONTEND: Extend axiosInstance to include IdToken in header, handle 401 responses. Add AuthError (class that) extends ApplicationError, remove TemporaryUnionFillerError. Add Races page with required functionality to fetch, list and post new races |
| 2025.06.18 | 0.5 | BACKEND: Refactor races API to return RaceListing instead of full Race after creating new |
| 2025.06.19 | 0.5 | BACKEND: Add DB migration:down for test env. Extend logger module. Configure DB module, rollback logging. Close db-connection after rollbacking |
| 2025.06.20 | 2   | FRONTEND: Add WithRequiredFields utility type. Extend Form with Date Picker |
| 2025.06.23 | 2   | FRONTEND: Add Form DateRange picker, dateTools module, extend formik ErrorRenderer component, supporting code |
| 2025.06.24 | 1   | FRONTEND: Add Form Checkbox component, minor fixes to other Form Components |
| 2025.06.26 | 4   | BACKEND: Extend race model/tests with public, dateFrom/To, registrationDateFrom/To fields. Add dateTools module.
| 2025.06.26 | 1   | FRONTEND: Extend Races creation with dates |
| 2025.06.27 | 3   | FRONTEND: Add react-native-tab-view, RaceContext. Use tab-view for Races listing/creation. Stylize Races view |
| 2025.06.27 | 0.5 | FRONTEND: Refactor RacesView to return FlatList, stylize containers |
| 2025.06.27 | 1   | FRONTEND: Implement Form clearing after submit. Use in SignIn/Up & RaceCreation |
| 2025.06.28 | 3.5 | FRONTEND: Add react-redux, @reduxjs/toolkit. Implement redux store, slice for races. Refactor race state from context => redux slice |
| 2025.06.29 | 3   | FRONTEND: Add authSlice to redux, move auth state there. Remove firebase user from auth state. Add ServerConflictError class |
| 2025.06.30 | 1   | FRONTEND: Remove zod, refactor utils/config to parse with Yup, add firebase emulator status check |
| 2025.07.02 | 0   | BACKEND: Add NotFoundError class, npm script tsc --noEmit |
| 2025.07.02 | 2   | PACKAGES: Configure packages/common tsconfig to emit declarations only, better importing of types in back-/frontend. Attempted to configure the project so typing works for imported types from packages/common in backend/tests, without success |
| 2025.07.03 | 1   | BACKEND: Add API endpoint to fetch race data by id |
| 2025.07.03 | 2   | FRONTEND: Add a view with required supporting logic to show a specific race |
| 2025.07.04 | 1.5 | FRONTEND: Add "models" directory that holds helper functions related to backend models, implement diff helpers. Add API response validator |
| 2025.07.04 | 1   | FRONTEND: Validate fetch race response, refactor raceSlice to store race data |
| 2025.07.04 | 0.5 | FRONTEND: Add Link, LoadingOrErrorRenderer components |
| 2025.07.05 | 2   | FRONTEND: Stylize RaceView, extend theme |
| 2025.07.05 | 0   | FRONTEND: Extend Form to support optional initialValue for every inputType |
| 2025.07.05 | 1   | FRONTEND: Refactor NewRace formFields and validationSchema |
| 2025.07.06 | 0.5 | BACKEND: Include express default type params for interface RequestUserExtended |
| 2025.07.06 | 0   | BACKEND: Add PermissionForbiddenError |
| 2025.07.06 | 2.5 | BACKEND: Add API endpoint for deleting race by id, tests |
| 2025.07.11 | 1   | FRONTEND: define test env to config, add Modal component |
| 2025.07.11 | 4   | FRONTEND: Add useRace hook and implement a race details editor. Refactor race related helpers. Stylize |
| 2025.07.12 | 2   | FRONTEND: Add PermissionForbiddenError, confirmation dialog, deletion of selected race |
| 2025.07.21 | 1   | FRONTEND: Add enableReinitialize prop to Form component, manage race editor form state when updating race details |
| 2025.07.23 | 0   | FRONTEND: Add ReplaceField utility type, refactor store raceSlice |
| 2025.08.05 | 7   | BACKEND: Implement race patch endpoind with tests, fix minor bugs related to race functionality and testing. |
| 2025.08.05 | 0.5 | BACKEND: Add constants module |
| 2025.08.06 | 2.5 | Add common interface RaceListingData that contains only serializable data, use in rest api and frontend. Refactor front- and backend to use the new interface |
| 2025.08.07 | 2   | FRONTEND: Add react-native-async-storage, configure firebase auth to persist user's session in mobile environments |
| 2025.08.08 | 2   | Add @common interface UserDetailsData. Refactor Back- & Frontend to use the new interface instead of User in suitable parts |
| 2025.08.09 | 0.5 | FRONTEND: Validate auth API responses |
| 2025.08.09 | 0.5 | FRONTEND: Add UserDetails type, refactor SelectAuth to return objects of this type |
| 2025.08.11 | 2   | BACKEND: Add user route, implement user (soft) deletion |
| 2025.08.12 | 2   | FRONTEND: Add DangerZone component to UserProfile page where user can delete her profile, implement required logic |
| 2025.08.13 | 2   | FRONTEND: Add password confirmation to user profile deletion |
| 2025.08.18 | 0.5 | BACKEND: Refactor userExtractor to not throw if firebase token user uid was not found in local DB |
| 2025.08.18 | 0.5 | BACKEND: Delete RequestUserExtended interface and augment @types/express Request type with optional user field |
| 2025.08.19 | 1   | BACKEND: Add interface for objects holding constants, refactor sql table- and model names into constants |
| 2025.08.19 | 1   | BACKEND: Add migrations and models for Sailboat and UserSailboat junction table |
| 2025.08.21 | 0.5 | BACKEND: Add BoatType enum, extend sailboat model, refactor |
| 2025.08.21 | 0.5 | COMMON: Add interface UserIdentity. BACKEND: Rename UserSailboat => UserSailboats |
| 2025.08.21 | 1   | BACKEND: Add API /boats router, service. Implement POST new sailboat. COMMON: Add related types |
| 2025.08.21 | 1   | BACKEND: Refactor tests, clear DB for every test suite. Add first test for /boats API |
| 2025.08.21 | 2   | BACKEND: Add newBoatParser to API /boat POST. Implement tests for creating new sailboat |
| 2025.08.22 | 2   | BACKEND: Add fields boatType to Sailboat, sailboats to User. Add boats to UserDetailsData interface with required refactoring |
| 2025.08.22 | 0   | BACKEND: Add boats: BoatIdentity[] field to User model, refactor UserDetailsData.boats -> boatIdentities |
| 2025.08.22 | 0.5 | BACKEND: Add /auth integration test that asserts that Users boatIdentities are returned after login |
| 2025.08.22 | 1   | FRONTEND: Add boatIdentities to userDetailsDataSchema, tab-view to user profile and render users boats |
| 2025.08.23 | 1.5 | FRONTEND: Add boatService, boat schemas, boatSlice to store. BoatView to user profile page, rename UserBoats -> BoatsList |
| 2025.08.23 | 0.5 | BACKEND: Add API endpoint to query boat by id, return BoatCreateResponseData instead of SailboatData after POST new sailboat |
| 2025.08.23 | 2.5 | FRONTEND: Extend Modal component, implement creation of new boats for user |
| 2025.08.23 | 0.5 | BACKEND: Add tests for GET /boat/:id, fix return message for NotFoundError |
| 2025.08.24 | 2.5 | BACKEND: Add userIdentities virtual property to Sailboat model, implement POST /boat/:id endpoint with tests |
| 2025.08.24 | 1   | FRONTEND: Add BoatEditor, feature for users to edit their boats |
| 2025.08.27 | 4   | BACKEND: Add API DELETE /boat:id/users/:userID, removes user from userSailboats and orphan sailboats. Refactor userSailboats soft->hard deletion and set onDelete CASCADE. Add deletion hooks to models |
| 2025.08.27 | 1   | FRONTEND: Add resign from boat owners/delete boat to BoatEditor, implement logic |
| 2025.08.27 | 0   | COMMON: Rename users -> userIdentities in interface SailboatData, refactor back- and frontend |
| 2025.08.27 | 1   | BACKEND: Add id (multiple, named) extractor middleware |
| 2025.08.28 | 1   | FRONTEND: Add missing, restructure validators for API responses |
| 2025.08.29 | 0.5 | FRONTEND: Add expo-location, expo-task-manager packages. Update app.config.js configuration and add configuration for location permissions |
| 2025.09.04 | 0.5 | FRONTEND: Add Location Dashboard, render current location |
| 2025.09.05 | 0.5 | FRONTEND: Add locationSlice, watchPosition from Component |
| 2025.09.09 | 0.5 | FRONTEND: Add useLocation hook |
| 2025.09.11 | 3   | FRONTEND: Configure and document EAS Development build process, fix package versions |
| 2025.09.12 | 2.5 | FRONTEND: Add (background) taskManager, location module, implement background location tracking |
| 2025.09.15 | 2.5 | FRONTEND: Refactor location module, backgroundTasks, useLocation hook, add foreground watchPosition subscription (when running in on web) |
| Total | 185 | |
