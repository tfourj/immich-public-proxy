"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const immich_1 = tslib_1.__importDefault(require("./immich"));
const render_1 = tslib_1.__importDefault(require("./render"));
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const types_1 = require("./types");
require('dotenv').config();
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(express_1.default.static('public'));
// An incoming request for a shared link
app.get('/share/:key', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    res.set('Cache-Control', 'public, max-age=' + process.env.CACHE_AGE);
    if (!immich_1.default.isKey(req.params.key)) {
        (0, exports.log)('Invalid share key ' + req.params.key);
        res.status(404).send();
    }
    else {
        const sharedLink = yield immich_1.default.getShareByKey(req.params.key);
        if (!sharedLink) {
            (0, exports.log)('Unknown share key ' + req.params.key);
            res.status(404).send();
        }
        else if (!sharedLink.assets.length) {
            (0, exports.log)('No assets for key ' + req.params.key);
            res.status(404).send();
        }
        else if (sharedLink.assets.length === 1) {
            // This is an individual item (not a gallery)
            (0, exports.log)('Serving link ' + req.params.key);
            const asset = sharedLink.assets[0];
            if (asset.type === types_1.AssetType.image) {
                // For photos, output the image directly
                yield render_1.default.assetBuffer(res, sharedLink.assets[0], getSize(req));
            }
            else if (asset.type === types_1.AssetType.video) {
                // For videos, show the video as a web player
                yield render_1.default.gallery(res, sharedLink, 1);
            }
        }
        else {
            // Multiple images - render as a gallery
            (0, exports.log)('Serving link ' + req.params.key);
            yield render_1.default.gallery(res, sharedLink);
        }
    }
}));
// Output the buffer data for a photo or video
app.get('/:type(photo|video)/:key/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    res.set('Cache-Control', 'public, max-age=' + process.env.CACHE_AGE);
    // Check for valid key and ID
    if (immich_1.default.isKey(req.params.key) && immich_1.default.isId(req.params.id)) {
        // Check if the key is a valid share link
        const sharedLink = yield immich_1.default.getShareByKey(req.params.key);
        if (sharedLink === null || sharedLink === void 0 ? void 0 : sharedLink.assets.length) {
            // Check that the requested asset exists in this share
            const asset = sharedLink.assets.find(x => x.id === req.params.id);
            if (asset) {
                asset.type = req.params.type === 'video' ? types_1.AssetType.video : types_1.AssetType.image;
                render_1.default.assetBuffer(res, asset, getSize(req)).then();
                return;
            }
        }
    }
    (0, exports.log)('No asset found for ' + req.path);
    res.status(404).send();
}));
// Send a 404 for all other routes
app.get('*', (req, res) => {
    (0, exports.log)('Invalid route ' + req.path);
    res.status(404).send();
});
/**
 * Sanitise the data for an incoming query string `size` parameter
 * e.g. https://example.com/share/abc...xyz?size=thumbnail
 */
const getSize = (req) => {
    var _a;
    return ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.size) === 'thumbnail' ? types_1.ImageSize.thumbnail : types_1.ImageSize.original;
};
/**
 * Output a console.log message with timestamp
 */
const log = (message) => console.log((0, dayjs_1.default)().format() + ' ' + message);
exports.log = log;
app.listen(3000, () => {
    console.log((0, dayjs_1.default)().format() + ' Server started');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLDhEQUE2QjtBQUM3Qiw4REFBNkI7QUFDN0IsOERBQTZCO0FBQzdCLDBEQUF5QjtBQUN6QixtQ0FBOEM7QUFHOUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBRTFCLE1BQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFBO0FBQ3JCLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUVqQyx3Q0FBd0M7QUFDeEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDeEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUNwRSxJQUFJLENBQUMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ2xDLElBQUEsV0FBRyxFQUFDLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDMUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUN4QixDQUFDO1NBQU0sQ0FBQztRQUNOLE1BQU0sVUFBVSxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM3RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDaEIsSUFBQSxXQUFHLEVBQUMsb0JBQW9CLEdB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LEdBQUcsQ0FBQyxJQUFBLGVBQUssR0FBRSxDQUFDLE1BQU0sRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUE7QUFDbkQsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGltbWljaCBmcm9tICcuL2ltbWljaCdcbmltcG9ydCByZW5kZXIgZnJvbSAnLi9yZW5kZXInXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5pbXBvcnQgeyBBc3NldFR5cGUsIEltYWdlU2l6ZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcy1zZXJ2ZS1zdGF0aWMtY29yZSdcblxucmVxdWlyZSgnZG90ZW52JykuY29uZmlnKClcblxuY29uc3QgYXBwID0gZXhwcmVzcygpXG5hcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKVxuYXBwLnVzZShleHByZXNzLnN0YXRpYygncHVibGljJykpXG5cbi8vIEFuIGluY29taW5nIHJlcXVlc3QgZm9yIGEgc2hhcmVkIGxpbmtcbmFwcC5nZXQoJy9zaGFyZS86a2V5JywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIHJlcy5zZXQoJ0NhY2hlLUNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPScgKyBwcm9jZXNzLmVudi5DQUNIRV9BR0UpXG4gIGlmICghaW1taWNoLmlzS2V5KHJlcS5wYXJhbXMua2V5KSkge1xuICAgIGxvZygnSW52YWxpZCBzaGFyZSBrZXkgJyArIHJlcS5wYXJhbXMua2V5KVxuICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKClcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBzaGFyZWRMaW5rID0gYXdhaXQgaW1taWNoLmdldFNoYXJlQnlLZXkocmVxLnBhcmFtcy5rZXkpXG4gICAgaWYgKCFzaGFyZWRMaW5rKSB7XG4gICAgICBsb2coJ1Vua25vd24gc2hhcmUga2V5ICcgKyByZXEucGFyYW1zLmtleSlcbiAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKClcbiAgICB9IGVsc2UgaWYgKCFzaGFyZWRMaW5rLmFzc2V0cy5sZW5ndGgpIHtcbiAgICAgIGxvZygnTm8gYXNzZXRzIGZvciBrZXkgJyArIHJlcS5wYXJhbXMua2V5KVxuICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKVxuICAgIH0gZWxzZSBpZiAoc2hhcmVkTGluay5hc3NldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBUaGlzIGlzIGFuIGluZGl2aWR1YWwgaXRlbSAobm90IGEgZ2FsbGVyeSlcbiAgICAgIGxvZygnU2VydmluZyBsaW5rICcgKyByZXEucGFyYW1zLmtleSlcbiAgICAgIGNvbnN0IGFzc2V0ID0gc2hhcmVkTGluay5hc3NldHNbMF1cbiAgICAgIGlmIChhc3NldC50eXBlID09PSBBc3NldFR5cGUuaW1hZ2UpIHtcbiAgICAgICAgLy8gRm9yIHBob3Rvcywgb3V0cHV0IHRoZSBpbWFnZSBkaXJlY3RseVxuICAgICAgICBhd2FpdCByZW5kZXIuYXNzZXRCdWZmZXIocmVzLCBzaGFyZWRMaW5rLmFzc2V0c1swXSwgZ2V0U2l6ZShyZXEpKVxuICAgICAgfSBlbHNlIGlmIChhc3NldC50eXBlID09PSBBc3NldFR5cGUudmlkZW8pIHtcbiAgICAgICAgLy8gRm9yIHZpZGVvcywgc2hvdyB0aGUgdmlkZW8gYXMgYSB3ZWIgcGxheWVyXG4gICAgICAgIGF3YWl0IHJlbmRlci5nYWxsZXJ5KHJlcywgc2hhcmVkTGluaywgMSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTXVsdGlwbGUgaW1hZ2VzIC0gcmVuZGVyIGFzIGEgZ2FsbGVyeVxuICAgICAgbG9nKCdTZXJ2aW5nIGxpbmsgJyArIHJlcS5wYXJhbXMua2V5KVxuICAgICAgYXdhaXQgcmVuZGVyLmdhbGxlcnkocmVzLCBzaGFyZWRMaW5rKVxuICAgIH1cbiAgfVxufSlcblxuLy8gT3V0cHV0IHRoZSBidWZmZXIgZGF0YSBmb3IgYSBwaG90byBvciB2aWRlb1xuYXBwLmdldCgnLzp0eXBlKHBob3RvfHZpZGVvKS86a2V5LzppZCcsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICByZXMuc2V0KCdDYWNoZS1Db250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0nICsgcHJvY2Vzcy5lbnYuQ0FDSEVfQUdFKVxuICAvLyBDaGVjayBmb3IgdmFsaWQga2V5IGFuZCBJRFxuICBpZiAoaW1taWNoLmlzS2V5KHJlcS5wYXJhbXMua2V5KSAmJiBpbW1pY2guaXNJZChyZXEucGFyYW1zLmlkKSkge1xuICAgIC8vIENoZWNrIGlmIHRoZSBrZXkgaXMgYSB2YWxpZCBzaGFyZSBsaW5rXG4gICAgY29uc3Qgc2hhcmVkTGluayA9IGF3YWl0IGltbWljaC5nZXRTaGFyZUJ5S2V5KHJlcS5wYXJhbXMua2V5KVxuICAgIGlmIChzaGFyZWRMaW5rPy5hc3NldHMubGVuZ3RoKSB7XG4gICAgICAvLyBDaGVjayB0aGF0IHRoZSByZXF1ZXN0ZWQgYXNzZXQgZXhpc3RzIGluIHRoaXMgc2hhcmVcbiAgICAgIGNvbnN0IGFzc2V0ID0gc2hhcmVkTGluay5hc3NldHMuZmluZCh4ID0+IHguaWQgPT09IHJlcS5wYXJhbXMuaWQpXG4gICAgICBpZiAoYXNzZXQpIHtcbiAgICAgICAgYXNzZXQudHlwZSA9IHJlcS5wYXJhbXMudHlwZSA9PT0gJ3ZpZGVvJyA/IEFzc2V0VHlwZS52aWRlbyA6IEFzc2V0VHlwZS5pbWFnZVxuICAgICAgICByZW5kZXIuYXNzZXRCdWZmZXIocmVzLCBhc3NldCwgZ2V0U2l6ZShyZXEpKS50aGVuKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGxvZygnTm8gYXNzZXQgZm91bmQgZm9yICcgKyByZXEucGF0aClcbiAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKVxufSlcblxuLy8gU2VuZCBhIDQwNCBmb3IgYWxsIG90aGVyIHJvdXRlc1xuYXBwLmdldCgnKicsIChyZXEsIHJlcykgPT4ge1xuICBsb2coJ0ludmFsaWQgcm91dGUgJyArIHJlcS5wYXRoKVxuICByZXMuc3RhdHVzKDQwNCkuc2VuZCgpXG59KVxuXG4vKipcbiAqIFNhbml0aXNlIHRoZSBkYXRhIGZvciBhbiBpbmNvbWluZyBxdWVyeSBzdHJpbmcgYHNpemVgIHBhcmFtZXRlclxuICogZS5nLiBodHRwczovL2V4YW1wbGUuY29tL3NoYXJlL2FiYy4uLnh5ej9zaXplPXRodW1ibmFpbFxuICovXG5jb25zdCBnZXRTaXplID0gKHJlcTogUmVxdWVzdCkgPT4ge1xuICByZXR1cm4gcmVxPy5xdWVyeT8uc2l6ZSA9PT0gJ3RodW1ibmFpbCcgPyBJbWFnZVNpemUudGh1bWJuYWlsIDogSW1hZ2VTaXplLm9yaWdpbmFsXG59XG5cbi8qKlxuICogT3V0cHV0IGEgY29uc29sZS5sb2cgbWVzc2FnZSB3aXRoIHRpbWVzdGFtcFxuICovXG5leHBvcnQgY29uc3QgbG9nID0gKG1lc3NhZ2U6IHN0cmluZykgPT4gY29uc29sZS5sb2coZGF5anMoKS5mb3JtYXQoKSArICcgJyArIG1lc3NhZ2UpXG5cbmFwcC5saXN0ZW4oMzAwMCwgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhkYXlqcygpLmZvcm1hdCgpICsgJyBTZXJ2ZXIgc3RhcnRlZCcpXG59KVxuIl19