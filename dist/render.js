"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const immich_1 = tslib_1.__importDefault(require("./immich"));
const types_1 = require("./types");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
class Render {
    assetBuffer(res, asset, size) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield immich_1.default.getAssetBuffer(asset, size);
            if (data) {
                for (const header of ['content-type', 'content-length']) {
                    res.set(header, data.headers[header]);
                }
                console.log(`${(0, dayjs_1.default)().format()} Serving asset ${asset.id}`);
                res.send(Buffer.from(yield data.arrayBuffer()));
            }
            else {
                res.status(404).send();
            }
        });
    }
    gallery(res, assets, openItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const items = [];
            for (const asset of assets) {
                let video;
                if (asset.type === types_1.AssetType.video) {
                    // Populate the data-video property
                    video = JSON.stringify({
                        source: [
                            {
                                src: immich_1.default.videoUrl(asset.id),
                                type: yield immich_1.default.getContentType(asset)
                            }
                        ],
                        attributes: {
                            preload: false,
                            controls: true
                        }
                    });
                }
                items.push({
                    originalUrl: immich_1.default.photoUrl(asset.id),
                    thumbnailUrl: immich_1.default.photoUrl(asset.id, types_1.ImageSize.thumbnail),
                    video
                });
            }
            res.render('gallery', {
                items,
                openItem
            });
        });
    }
}
const render = new Render();
exports.default = render;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JlbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFBNkI7QUFFN0IsbUNBQXFEO0FBQ3JELDBEQUF5QjtBQUV6QixNQUFNLE1BQU07SUFDSixXQUFXLENBQUUsR0FBYSxFQUFFLEtBQVksRUFBRSxJQUFnQjs7WUFDOUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFDckQsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDVCxLQUFLLE1BQU0sTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztvQkFDeEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO2dCQUN2QyxDQUFDO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFBLGVBQUssR0FBRSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQzVELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDakQsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDeEIsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBRSxHQUFhLEVBQUUsTUFBZSxFQUFFLFFBQWlCOztZQUM5RCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUE7WUFDaEIsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxLQUFLLENBQUE7Z0JBQ1QsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ25DLG1DQUFtQztvQkFDbkMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQ3JCLE1BQU0sRUFBRTs0QkFDTjtnQ0FDRSxHQUFHLEVBQUUsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQ0FDOUIsSUFBSSxFQUFFLE1BQU0sZ0JBQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDOzZCQUN6Qzt5QkFDRjt3QkFDRCxVQUFVLEVBQUU7NEJBQ1YsT0FBTyxFQUFFLEtBQUs7NEJBQ2QsUUFBUSxFQUFFLElBQUk7eUJBQ2Y7cUJBQ0YsQ0FBQyxDQUFBO2dCQUNKLENBQUM7Z0JBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDVCxXQUFXLEVBQUUsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDdEMsWUFBWSxFQUFFLGdCQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsaUJBQVMsQ0FBQyxTQUFTLENBQUM7b0JBQzVELEtBQUs7aUJBQ04sQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUNwQixLQUFLO2dCQUNMLFFBQVE7YUFDVCxDQUFDLENBQUE7UUFDSixDQUFDO0tBQUE7Q0FDRjtBQUVELE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUE7QUFFM0Isa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGltbWljaCBmcm9tICcuL2ltbWljaCdcbmltcG9ydCB7IFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcy1zZXJ2ZS1zdGF0aWMtY29yZSdcbmltcG9ydCB7IEFzc2V0LCBBc3NldFR5cGUsIEltYWdlU2l6ZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5cbmNsYXNzIFJlbmRlciB7XG4gIGFzeW5jIGFzc2V0QnVmZmVyIChyZXM6IFJlc3BvbnNlLCBhc3NldDogQXNzZXQsIHNpemU/OiBJbWFnZVNpemUpIHtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgaW1taWNoLmdldEFzc2V0QnVmZmVyKGFzc2V0LCBzaXplKVxuICAgIGlmIChkYXRhKSB7XG4gICAgICBmb3IgKGNvbnN0IGhlYWRlciBvZiBbJ2NvbnRlbnQtdHlwZScsICdjb250ZW50LWxlbmd0aCddKSB7XG4gICAgICAgIHJlcy5zZXQoaGVhZGVyLCBkYXRhLmhlYWRlcnNbaGVhZGVyXSlcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKGAke2RheWpzKCkuZm9ybWF0KCl9IFNlcnZpbmcgYXNzZXQgJHthc3NldC5pZH1gKVxuICAgICAgcmVzLnNlbmQoQnVmZmVyLmZyb20oYXdhaXQgZGF0YS5hcnJheUJ1ZmZlcigpKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdhbGxlcnkgKHJlczogUmVzcG9uc2UsIGFzc2V0czogQXNzZXRbXSwgb3Blbkl0ZW0/OiBudW1iZXIpIHtcbiAgICBjb25zdCBpdGVtcyA9IFtdXG4gICAgZm9yIChjb25zdCBhc3NldCBvZiBhc3NldHMpIHtcbiAgICAgIGxldCB2aWRlb1xuICAgICAgaWYgKGFzc2V0LnR5cGUgPT09IEFzc2V0VHlwZS52aWRlbykge1xuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgZGF0YS12aWRlbyBwcm9wZXJ0eVxuICAgICAgICB2aWRlbyA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBzb3VyY2U6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3JjOiBpbW1pY2gudmlkZW9VcmwoYXNzZXQuaWQpLFxuICAgICAgICAgICAgICB0eXBlOiBhd2FpdCBpbW1pY2guZ2V0Q29udGVudFR5cGUoYXNzZXQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbnRyb2xzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgIG9yaWdpbmFsVXJsOiBpbW1pY2gucGhvdG9VcmwoYXNzZXQuaWQpLFxuICAgICAgICB0aHVtYm5haWxVcmw6IGltbWljaC5waG90b1VybChhc3NldC5pZCwgSW1hZ2VTaXplLnRodW1ibmFpbCksXG4gICAgICAgIHZpZGVvXG4gICAgICB9KVxuICAgIH1cbiAgICByZXMucmVuZGVyKCdnYWxsZXJ5Jywge1xuICAgICAgaXRlbXMsXG4gICAgICBvcGVuSXRlbVxuICAgIH0pXG4gIH1cbn1cblxuY29uc3QgcmVuZGVyID0gbmV3IFJlbmRlcigpXG5cbmV4cG9ydCBkZWZhdWx0IHJlbmRlclxuIl19