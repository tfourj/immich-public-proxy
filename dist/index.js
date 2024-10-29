"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const getSize = (req) => {
    var _a;
    return ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.size) === 'thumbnail' ? types_1.ImageSize.thumbnail : types_1.ImageSize.original;
};
app.get('/share/:key', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!immich_1.default.isKey(req.params.key)) {
        res.status(404).send();
    }
    else {
        const sharedLink = yield immich_1.default.getShareByKey(req.params.key);
        if (!sharedLink || !sharedLink.assets.length) {
            res.status(404).send();
        }
        else if (sharedLink.assets.length === 1) {
            // This is an individual item (not a gallery)
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
            yield render_1.default.gallery(res, sharedLink);
        }
    }
}));
// Output the buffer data for an photo or video
app.get('/:type(photo|video)/:key/:id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
    res.status(404).send();
}));
// Send a 404 for all other unmatched routes
app.get('*', (_req, res) => {
    res.status(404).send();
});
app.listen(3000, () => {
    console.log((0, dayjs_1.default)().format() + ' Server started');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQTZCO0FBQzdCLDhEQUE2QjtBQUM3Qiw4REFBNkI7QUFDN0IsMERBQXlCO0FBQ3pCLG1DQUE4QztBQUc5QyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFMUIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUE7QUFDckIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDN0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBRWpDLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBWSxFQUFFLEVBQUU7O0lBQy9CLE9BQU8sQ0FBQSxNQUFBLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLElBQUksTUFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBUyxDQUFDLFFBQVEsQ0FBQTtBQUNwRixDQUFDLENBQUE7QUFFRCxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUN4QyxJQUFJLENBQUMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDeEIsQ0FBQztTQUFNLENBQUM7UUFDTixNQUFNLFVBQVUsR0FBRyxNQUFNLGdCQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDN0QsSUFBSSxDQUFDLFVBQVUsSUFB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SUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGVBQUssR0FBRSxDQUFDLE1BQU0sRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUE7QUFDbkQsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGltbWljaCBmcm9tICcuL2ltbWljaCdcbmltcG9ydCByZW5kZXIgZnJvbSAnLi9yZW5kZXInXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5pbXBvcnQgeyBBc3NldFR5cGUsIEltYWdlU2l6ZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcy1zZXJ2ZS1zdGF0aWMtY29yZSdcblxucmVxdWlyZSgnZG90ZW52JykuY29uZmlnKClcblxuY29uc3QgYXBwID0gZXhwcmVzcygpXG5hcHAuc2V0KCd2aWV3IGVuZ2luZScsICdlanMnKVxuYXBwLnVzZShleHByZXNzLnN0YXRpYygncHVibGljJykpXG5cbmNvbnN0IGdldFNpemUgPSAocmVxOiBSZXF1ZXN0KSA9PiB7XG4gIHJldHVybiByZXE/LnF1ZXJ5Py5zaXplID09PSAndGh1bWJuYWlsJyA/IEltYWdlU2l6ZS50aHVtYm5haWwgOiBJbWFnZVNpemUub3JpZ2luYWxcbn1cblxuYXBwLmdldCgnL3NoYXJlLzprZXknLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgaWYgKCFpbW1pY2guaXNLZXkocmVxLnBhcmFtcy5rZXkpKSB7XG4gICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNoYXJlZExpbmsgPSBhd2FpdCBpbW1pY2guZ2V0U2hhcmVCeUtleShyZXEucGFyYW1zLmtleSlcbiAgICBpZiAoIXNoYXJlZExpbmsgfHwgIXNoYXJlZExpbmsuYXNzZXRzLmxlbmd0aCkge1xuICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKVxuICAgIH0gZWxzZSBpZiAoc2hhcmVkTGluay5hc3NldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBUaGlzIGlzIGFuIGluZGl2aWR1YWwgaXRlbSAobm90IGEgZ2FsbGVyeSlcbiAgICAgIGNvbnN0IGFzc2V0ID0gc2hhcmVkTGluay5hc3NldHNbMF1cbiAgICAgIGlmIChhc3NldC50eXBlID09PSBBc3NldFR5cGUuaW1hZ2UpIHtcbiAgICAgICAgLy8gRm9yIHBob3Rvcywgb3V0cHV0IHRoZSBpbWFnZSBkaXJlY3RseVxuICAgICAgICBhd2FpdCByZW5kZXIuYXNzZXRCdWZmZXIocmVzLCBzaGFyZWRMaW5rLmFzc2V0c1swXSwgZ2V0U2l6ZShyZXEpKVxuICAgICAgfSBlbHNlIGlmIChhc3NldC50eXBlID09PSBBc3NldFR5cGUudmlkZW8pIHtcbiAgICAgICAgLy8gRm9yIHZpZGVvcywgc2hvdyB0aGUgdmlkZW8gYXMgYSB3ZWIgcGxheWVyXG4gICAgICAgIGF3YWl0IHJlbmRlci5nYWxsZXJ5KHJlcywgc2hhcmVkTGluaywgMSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTXVsdGlwbGUgaW1hZ2VzIC0gcmVuZGVyIGFzIGEgZ2FsbGVyeVxuICAgICAgYXdhaXQgcmVuZGVyLmdhbGxlcnkocmVzLCBzaGFyZWRMaW5rKVxuICAgIH1cbiAgfVxufSlcblxuLy8gT3V0cHV0IHRoZSBidWZmZXIgZGF0YSBmb3IgYW4gcGhvdG8gb3IgdmlkZW9cbmFwcC5nZXQoJy86dHlwZShwaG90b3x2aWRlbykvOmtleS86aWQnLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgLy8gQ2hlY2sgZm9yIHZhbGlkIGtleSBhbmQgSURcbiAgaWYgKGltbWljaC5pc0tleShyZXEucGFyYW1zLmtleSkgJiYgaW1taWNoLmlzSWQocmVxLnBhcmFtcy5pZCkpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUga2V5IGlzIGEgdmFsaWQgc2hhcmUgbGlua1xuICAgIGNvbnN0IHNoYXJlZExpbmsgPSBhd2FpdCBpbW1pY2guZ2V0U2hhcmVCeUtleShyZXEucGFyYW1zLmtleSlcbiAgICBpZiAoc2hhcmVkTGluaz8uYXNzZXRzLmxlbmd0aCkge1xuICAgICAgLy8gQ2hlY2sgdGhhdCB0aGUgcmVxdWVzdGVkIGFzc2V0IGV4aXN0cyBpbiB0aGlzIHNoYXJlXG4gICAgICBjb25zdCBhc3NldCA9IHNoYXJlZExpbmsuYXNzZXRzLmZpbmQoeCA9PiB4LmlkID09PSByZXEucGFyYW1zLmlkKVxuICAgICAgaWYgKGFzc2V0KSB7XG4gICAgICAgIGFzc2V0LnR5cGUgPSByZXEucGFyYW1zLnR5cGUgPT09ICd2aWRlbycgPyBBc3NldFR5cGUudmlkZW8gOiBBc3NldFR5cGUuaW1hZ2VcbiAgICAgICAgcmVuZGVyLmFzc2V0QnVmZmVyKHJlcywgYXNzZXQsIGdldFNpemUocmVxKSkudGhlbigpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXMuc3RhdHVzKDQwNCkuc2VuZCgpXG59KVxuXG4vLyBTZW5kIGEgNDA0IGZvciBhbGwgb3RoZXIgdW5tYXRjaGVkIHJvdXRlc1xuYXBwLmdldCgnKicsIChfcmVxLCByZXMpID0+IHtcbiAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKVxufSlcblxuYXBwLmxpc3RlbigzMDAwLCAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKGRheWpzKCkuZm9ybWF0KCkgKyAnIFNlcnZlciBzdGFydGVkJylcbn0pXG4iXX0=