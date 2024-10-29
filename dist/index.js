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
    if (req.params.key.match(/[^\w-]/)) {
        // Invalid characters in the incoming URL
        res.status(404).send();
    }
    else {
        const share = yield immich_1.default.getShareByKey(req.params.key);
        if (!share || !share.assets.length) {
            res.status(404).send();
        }
        else if (share.assets.length === 1) {
            // This is an individual item (not a gallery)
            const asset = share.assets[0];
            if (asset.type === types_1.AssetType.image) {
                // Output the image directly
                yield render_1.default.assetBuffer(res, share.assets[0], getSize(req));
            }
            else if (asset.type === types_1.AssetType.video) {
                // Show the video as a web player
                yield render_1.default.gallery(res, share.assets, 1);
            }
        }
        else {
            // Multiple images - render as a gallery
            yield render_1.default.gallery(res, share.assets);
        }
    }
}));
// Output the buffer data for an photo or video
app.get('/:type(photo|video)/:id', (req, res) => {
    if (!immich_1.default.isId(req.params.id)) {
        // Invalid characters in the incoming URL
        res.status(404).send();
        return;
    }
    const asset = {
        id: req.params.id,
        type: req.params.type === 'video' ? types_1.AssetType.video : types_1.AssetType.image
    };
    switch (req.params.type) {
        case 'photo':
        case 'video':
            render_1.default.assetBuffer(res, asset, getSize(req)).then();
            break;
    }
});
app.listen(3000, () => {
    console.log((0, dayjs_1.default)().format() + ' Server started');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQTZCO0FBQzdCLDhEQUE2QjtBQUM3Qiw4REFBNkI7QUFDN0IsMERBQXlCO0FBQ3pCLG1DQUE4QztBQUc5QyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFMUIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUE7QUFDckIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDN0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBRWpDLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBWSxFQUFFLEVBQUU7O0lBQy9CLE9BQU8sQ0FBQSxNQUFBLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLElBQUksTUFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBUyxDQUFDLFFBQVEsQ0FBQTtBQUNwRixDQUFDLENBQUE7QUFFRCxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUN4QyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ25DLHlDQUF5QztRQUN6QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3hCLENBQUM7U0FBTSxDQUFDO1FBQ04sTUFBTSxLQUFLLEdBQUcsTUFBTSxnQkFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3hELElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ25DLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDeEIsQ0FBQzthQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDckMsNkNBQTZDO1lBQzdDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDN0IsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ25DLDRCQUE0QjtnQkFDNUIsTUFBTSxnQkFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUM5RCxDQUFDO2lCQUFNLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxpQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMxQyxpQ0FBaUM7Z0JBQ2pDLE1BQU0sZ0JBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDNUMsQ0FBQztRQUNILENBQUM7YUFBTSxDQUFDO1lBQ04sd0NBQXdDO1lBQ3hDLE1BQU0sZ0JBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN6QyxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7QUFFRiwrQ0FBK0M7QUFDL0MsR0FBRyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUM5QyxJQUFJLENBQUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ2hDLHlDQUF5QztRQUN6QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ3RCLE9BQU07SUFDUixDQUFDO0lBQ0QsTUFBTSxLQUFLLEdBQUc7UUFDWixFQUFFLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2pCLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxpQkFBUyxDQUFDLEtBQUs7S0FDdEUsQ0FBQTtJQUNELFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QixLQUFLLE9BQU8sQ0FBQztRQUNiLEtBQUssT0FBTztZQUNWLGdCQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDbkQsTUFBSztJQUNULENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQTtBQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUEsZUFBSyxHQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQTtBQUNuRCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgaW1taWNoIGZyb20gJy4vaW1taWNoJ1xuaW1wb3J0IHJlbmRlciBmcm9tICcuL3JlbmRlcidcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcbmltcG9ydCB7IEFzc2V0VHlwZSwgSW1hZ2VTaXplIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICdleHByZXNzLXNlcnZlLXN0YXRpYy1jb3JlJ1xuXG5yZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKVxuXG5jb25zdCBhcHAgPSBleHByZXNzKClcbmFwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpXG5hcHAudXNlKGV4cHJlc3Muc3RhdGljKCdwdWJsaWMnKSlcblxuY29uc3QgZ2V0U2l6ZSA9IChyZXE6IFJlcXVlc3QpID0+IHtcbiAgcmV0dXJuIHJlcT8ucXVlcnk/LnNpemUgPT09ICd0aHVtYm5haWwnID8gSW1hZ2VTaXplLnRodW1ibmFpbCA6IEltYWdlU2l6ZS5vcmlnaW5hbFxufVxuXG5hcHAuZ2V0KCcvc2hhcmUvOmtleScsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICBpZiAocmVxLnBhcmFtcy5rZXkubWF0Y2goL1teXFx3LV0vKSkge1xuICAgIC8vIEludmFsaWQgY2hhcmFjdGVycyBpbiB0aGUgaW5jb21pbmcgVVJMXG4gICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNoYXJlID0gYXdhaXQgaW1taWNoLmdldFNoYXJlQnlLZXkocmVxLnBhcmFtcy5rZXkpXG4gICAgaWYgKCFzaGFyZSB8fCAhc2hhcmUuYXNzZXRzLmxlbmd0aCkge1xuICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKVxuICAgIH0gZWxzZSBpZiAoc2hhcmUuYXNzZXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gVGhpcyBpcyBhbiBpbmRpdmlkdWFsIGl0ZW0gKG5vdCBhIGdhbGxlcnkpXG4gICAgICBjb25zdCBhc3NldCA9IHNoYXJlLmFzc2V0c1swXVxuICAgICAgaWYgKGFzc2V0LnR5cGUgPT09IEFzc2V0VHlwZS5pbWFnZSkge1xuICAgICAgICAvLyBPdXRwdXQgdGhlIGltYWdlIGRpcmVjdGx5XG4gICAgICAgIGF3YWl0IHJlbmRlci5hc3NldEJ1ZmZlcihyZXMsIHNoYXJlLmFzc2V0c1swXSwgZ2V0U2l6ZShyZXEpKVxuICAgICAgfSBlbHNlIGlmIChhc3NldC50eXBlID09PSBBc3NldFR5cGUudmlkZW8pIHtcbiAgICAgICAgLy8gU2hvdyB0aGUgdmlkZW8gYXMgYSB3ZWIgcGxheWVyXG4gICAgICAgIGF3YWl0IHJlbmRlci5nYWxsZXJ5KHJlcywgc2hhcmUuYXNzZXRzLCAxKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBNdWx0aXBsZSBpbWFnZXMgLSByZW5kZXIgYXMgYSBnYWxsZXJ5XG4gICAgICBhd2FpdCByZW5kZXIuZ2FsbGVyeShyZXMsIHNoYXJlLmFzc2V0cylcbiAgICB9XG4gIH1cbn0pXG5cbi8vIE91dHB1dCB0aGUgYnVmZmVyIGRhdGEgZm9yIGFuIHBob3RvIG9yIHZpZGVvXG5hcHAuZ2V0KCcvOnR5cGUocGhvdG98dmlkZW8pLzppZCcsIChyZXEsIHJlcykgPT4ge1xuICBpZiAoIWltbWljaC5pc0lkKHJlcS5wYXJhbXMuaWQpKSB7XG4gICAgLy8gSW52YWxpZCBjaGFyYWN0ZXJzIGluIHRoZSBpbmNvbWluZyBVUkxcbiAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgpXG4gICAgcmV0dXJuXG4gIH1cbiAgY29uc3QgYXNzZXQgPSB7XG4gICAgaWQ6IHJlcS5wYXJhbXMuaWQsXG4gICAgdHlwZTogcmVxLnBhcmFtcy50eXBlID09PSAndmlkZW8nID8gQXNzZXRUeXBlLnZpZGVvIDogQXNzZXRUeXBlLmltYWdlXG4gIH1cbiAgc3dpdGNoIChyZXEucGFyYW1zLnR5cGUpIHtcbiAgICBjYXNlICdwaG90byc6XG4gICAgY2FzZSAndmlkZW8nOlxuICAgICAgcmVuZGVyLmFzc2V0QnVmZmVyKHJlcywgYXNzZXQsIGdldFNpemUocmVxKSkudGhlbigpXG4gICAgICBicmVha1xuICB9XG59KVxuXG5hcHAubGlzdGVuKDMwMDAsICgpID0+IHtcbiAgY29uc29sZS5sb2coZGF5anMoKS5mb3JtYXQoKSArICcgU2VydmVyIHN0YXJ0ZWQnKVxufSlcbiJdfQ==