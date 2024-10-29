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
    res.set('Cache-Control', 'public, max-age=' + process.env.CACHE_AGE);
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
    res.status(404).send();
}));
// Send a 404 for all other unmatched routes
app.get('*', (_req, res) => {
    res.status(404).send();
});
app.listen(3000, () => {
    console.log((0, dayjs_1.default)().format() + ' Server started');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQTZCO0FBQzdCLDhEQUE2QjtBQUM3Qiw4REFBNkI7QUFDN0IsMERBQXlCO0FBQ3pCLG1DQUE4QztBQUc5QyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFMUIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUE7QUFDckIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDN0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBRWpDLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBWSxFQUFFLEVBQUU7O0lBQy9CLE9BQU8sQ0FBQSxNQUFBLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLElBQUksTUFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBUyxDQUFDLFFBQVEsQ0FBQTtBQUNwRixDQUFDLENBQUE7QUFFRCxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUN4QyxHQUFHLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3BFLElBQUksQ0FBQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDbEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUN4QixDQUFDO1NBQU0sQ0FBQztRQUNOLE1BQU0sVUFBVSxHQUFHLE1B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QUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUN6QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ3hCLENBQUMsQ0FBQyxDQUFBO0FBRUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBQSxlQUFLLEdBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ25ELENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcbmltcG9ydCBpbW1pY2ggZnJvbSAnLi9pbW1pY2gnXG5pbXBvcnQgcmVuZGVyIGZyb20gJy4vcmVuZGVyJ1xuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJ1xuaW1wb3J0IHsgQXNzZXRUeXBlLCBJbWFnZVNpemUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJ2V4cHJlc3Mtc2VydmUtc3RhdGljLWNvcmUnXG5cbnJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZygpXG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MoKVxuYXBwLnNldCgndmlldyBlbmdpbmUnLCAnZWpzJylcbmFwcC51c2UoZXhwcmVzcy5zdGF0aWMoJ3B1YmxpYycpKVxuXG5jb25zdCBnZXRTaXplID0gKHJlcTogUmVxdWVzdCkgPT4ge1xuICByZXR1cm4gcmVxPy5xdWVyeT8uc2l6ZSA9PT0gJ3RodW1ibmFpbCcgPyBJbWFnZVNpemUudGh1bWJuYWlsIDogSW1hZ2VTaXplLm9yaWdpbmFsXG59XG5cbmFwcC5nZXQoJy9zaGFyZS86a2V5JywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIHJlcy5zZXQoJ0NhY2hlLUNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPScgKyBwcm9jZXNzLmVudi5DQUNIRV9BR0UpXG4gIGlmICghaW1taWNoLmlzS2V5KHJlcS5wYXJhbXMua2V5KSkge1xuICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKClcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBzaGFyZWRMaW5rID0gYXdhaXQgaW1taWNoLmdldFNoYXJlQnlLZXkocmVxLnBhcmFtcy5rZXkpXG4gICAgaWYgKCFzaGFyZWRMaW5rIHx8ICFzaGFyZWRMaW5rLmFzc2V0cy5sZW5ndGgpIHtcbiAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKClcbiAgICB9IGVsc2UgaWYgKHNoYXJlZExpbmsuYXNzZXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gVGhpcyBpcyBhbiBpbmRpdmlkdWFsIGl0ZW0gKG5vdCBhIGdhbGxlcnkpXG4gICAgICBjb25zdCBhc3NldCA9IHNoYXJlZExpbmsuYXNzZXRzWzBdXG4gICAgICBpZiAoYXNzZXQudHlwZSA9PT0gQXNzZXRUeXBlLmltYWdlKSB7XG4gICAgICAgIC8vIEZvciBwaG90b3MsIG91dHB1dCB0aGUgaW1hZ2UgZGlyZWN0bHlcbiAgICAgICAgYXdhaXQgcmVuZGVyLmFzc2V0QnVmZmVyKHJlcywgc2hhcmVkTGluay5hc3NldHNbMF0sIGdldFNpemUocmVxKSlcbiAgICAgIH0gZWxzZSBpZiAoYXNzZXQudHlwZSA9PT0gQXNzZXRUeXBlLnZpZGVvKSB7XG4gICAgICAgIC8vIEZvciB2aWRlb3MsIHNob3cgdGhlIHZpZGVvIGFzIGEgd2ViIHBsYXllclxuICAgICAgICBhd2FpdCByZW5kZXIuZ2FsbGVyeShyZXMsIHNoYXJlZExpbmssIDEpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE11bHRpcGxlIGltYWdlcyAtIHJlbmRlciBhcyBhIGdhbGxlcnlcbiAgICAgIGF3YWl0IHJlbmRlci5nYWxsZXJ5KHJlcywgc2hhcmVkTGluaylcbiAgICB9XG4gIH1cbn0pXG5cbi8vIE91dHB1dCB0aGUgYnVmZmVyIGRhdGEgZm9yIGFuIHBob3RvIG9yIHZpZGVvXG5hcHAuZ2V0KCcvOnR5cGUocGhvdG98dmlkZW8pLzprZXkvOmlkJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIHJlcy5zZXQoJ0NhY2hlLUNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPScgKyBwcm9jZXNzLmVudi5DQUNIRV9BR0UpXG4gIC8vIENoZWNrIGZvciB2YWxpZCBrZXkgYW5kIElEXG4gIGlmIChpbW1pY2guaXNLZXkocmVxLnBhcmFtcy5rZXkpICYmIGltbWljaC5pc0lkKHJlcS5wYXJhbXMuaWQpKSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGtleSBpcyBhIHZhbGlkIHNoYXJlIGxpbmtcbiAgICBjb25zdCBzaGFyZWRMaW5rID0gYXdhaXQgaW1taWNoLmdldFNoYXJlQnlLZXkocmVxLnBhcmFtcy5rZXkpXG4gICAgaWYgKHNoYXJlZExpbms/LmFzc2V0cy5sZW5ndGgpIHtcbiAgICAgIC8vIENoZWNrIHRoYXQgdGhlIHJlcXVlc3RlZCBhc3NldCBleGlzdHMgaW4gdGhpcyBzaGFyZVxuICAgICAgY29uc3QgYXNzZXQgPSBzaGFyZWRMaW5rLmFzc2V0cy5maW5kKHggPT4geC5pZCA9PT0gcmVxLnBhcmFtcy5pZClcbiAgICAgIGlmIChhc3NldCkge1xuICAgICAgICBhc3NldC50eXBlID0gcmVxLnBhcmFtcy50eXBlID09PSAndmlkZW8nID8gQXNzZXRUeXBlLnZpZGVvIDogQXNzZXRUeXBlLmltYWdlXG4gICAgICAgIHJlbmRlci5hc3NldEJ1ZmZlcihyZXMsIGFzc2V0LCBnZXRTaXplKHJlcSkpLnRoZW4oKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKVxufSlcblxuLy8gU2VuZCBhIDQwNCBmb3IgYWxsIG90aGVyIHVubWF0Y2hlZCByb3V0ZXNcbmFwcC5nZXQoJyonLCAoX3JlcSwgcmVzKSA9PiB7XG4gIHJlcy5zdGF0dXMoNDA0KS5zZW5kKClcbn0pXG5cbmFwcC5saXN0ZW4oMzAwMCwgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhkYXlqcygpLmZvcm1hdCgpICsgJyBTZXJ2ZXIgc3RhcnRlZCcpXG59KVxuIl19