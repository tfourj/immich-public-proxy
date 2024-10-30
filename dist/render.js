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
    /**
     * Render a gallery page for a given SharedLink, using EJS and lightGallery.
     *
     * @param res - ExpressJS Response
     * @param share - Immich `shared-link` containing the assets to show in the gallery
     * @param [openItem] - Immediately open a lightbox to the Nth item when the gallery loads
     */
    gallery(res, share, openItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const items = [];
            for (const asset of share.assets) {
                let video;
                if (asset.type === types_1.AssetType.video) {
                    // Populate the data-video property
                    video = JSON.stringify({
                        source: [
                            {
                                src: immich_1.default.videoUrl(share.key, asset.id),
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
                    originalUrl: immich_1.default.photoUrl(share.key, asset.id),
                    thumbnailUrl: immich_1.default.photoUrl(share.key, asset.id, types_1.ImageSize.thumbnail),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JlbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFBNkI7QUFFN0IsbUNBQWlFO0FBQ2pFLDBEQUF5QjtBQUV6QixNQUFNLE1BQU07SUFDSixXQUFXLENBQUUsR0FBYSxFQUFFLEtBQVksRUFBRSxJQUFnQjs7WUFDOUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFDckQsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDVCxLQUFLLE1BQU0sTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztvQkFDeEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO2dCQUN2QyxDQUFDO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFBLGVBQUssR0FBRSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQzVELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDakQsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDeEIsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNHLE9BQU8sQ0FBRSxHQUFhLEVBQUUsS0FBaUIsRUFBRSxRQUFpQjs7WUFDaEUsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFBO1lBQ2hCLEtBQUssTUFBTSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNqQyxJQUFJLEtBQUssQ0FBQTtnQkFDVCxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDbkMsbUNBQW1DO29CQUNuQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzt3QkFDckIsTUFBTSxFQUFFOzRCQUNOO2dDQUNFLEdBQUcsRUFBRSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0NBQ3pDLElBQUksRUFBRSxNQUFNLGdCQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQzs2QkFDekM7eUJBQ0Y7d0JBQ0QsVUFBVSxFQUFFOzRCQUNWLE9BQU8sRUFBRSxLQUFLOzRCQUNkLFFBQVEsRUFBRSxJQUFJO3lCQUNmO3FCQUNGLENBQUMsQ0FBQTtnQkFDSixDQUFDO2dCQUNELEtBQUssQ0FBQyxJQUFJLENBQUM7b0JBQ1QsV0FBVyxFQUFFLGdCQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDakQsWUFBWSxFQUFFLGdCQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxpQkFBUyxDQUFDLFNBQVMsQ0FBQztvQkFDdkUsS0FBSztpQkFDTixDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ3BCLEtBQUs7Z0JBQ0wsUUFBUTthQUNULENBQUMsQ0FBQTtRQUNKLENBQUM7S0FBQTtDQUNGO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQTtBQUUzQixrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW1taWNoIGZyb20gJy4vaW1taWNoJ1xuaW1wb3J0IHsgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzLXNlcnZlLXN0YXRpYy1jb3JlJ1xuaW1wb3J0IHsgQXNzZXQsIEFzc2V0VHlwZSwgSW1hZ2VTaXplLCBTaGFyZWRMaW5rIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcblxuY2xhc3MgUmVuZGVyIHtcbiAgYXN5bmMgYXNzZXRCdWZmZXIgKHJlczogUmVzcG9uc2UsIGFzc2V0OiBBc3NldCwgc2l6ZT86IEltYWdlU2l6ZSkge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBpbW1pY2guZ2V0QXNzZXRCdWZmZXIoYXNzZXQsIHNpemUpXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGZvciAoY29uc3QgaGVhZGVyIG9mIFsnY29udGVudC10eXBlJywgJ2NvbnRlbnQtbGVuZ3RoJ10pIHtcbiAgICAgICAgcmVzLnNldChoZWFkZXIsIGRhdGEuaGVhZGVyc1toZWFkZXJdKVxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coYCR7ZGF5anMoKS5mb3JtYXQoKX0gU2VydmluZyBhc3NldCAke2Fzc2V0LmlkfWApXG4gICAgICByZXMuc2VuZChCdWZmZXIuZnJvbShhd2FpdCBkYXRhLmFycmF5QnVmZmVyKCkpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhIGdhbGxlcnkgcGFnZSBmb3IgYSBnaXZlbiBTaGFyZWRMaW5rLCB1c2luZyBFSlMgYW5kIGxpZ2h0R2FsbGVyeS5cbiAgICpcbiAgICogQHBhcmFtIHJlcyAtIEV4cHJlc3NKUyBSZXNwb25zZVxuICAgKiBAcGFyYW0gc2hhcmUgLSBJbW1pY2ggYHNoYXJlZC1saW5rYCBjb250YWluaW5nIHRoZSBhc3NldHMgdG8gc2hvdyBpbiB0aGUgZ2FsbGVyeVxuICAgKiBAcGFyYW0gW29wZW5JdGVtXSAtIEltbWVkaWF0ZWx5IG9wZW4gYSBsaWdodGJveCB0byB0aGUgTnRoIGl0ZW0gd2hlbiB0aGUgZ2FsbGVyeSBsb2Fkc1xuICAgKi9cbiAgYXN5bmMgZ2FsbGVyeSAocmVzOiBSZXNwb25zZSwgc2hhcmU6IFNoYXJlZExpbmssIG9wZW5JdGVtPzogbnVtYmVyKSB7XG4gICAgY29uc3QgaXRlbXMgPSBbXVxuICAgIGZvciAoY29uc3QgYXNzZXQgb2Ygc2hhcmUuYXNzZXRzKSB7XG4gICAgICBsZXQgdmlkZW9cbiAgICAgIGlmIChhc3NldC50eXBlID09PSBBc3NldFR5cGUudmlkZW8pIHtcbiAgICAgICAgLy8gUG9wdWxhdGUgdGhlIGRhdGEtdmlkZW8gcHJvcGVydHlcbiAgICAgICAgdmlkZW8gPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgc291cmNlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNyYzogaW1taWNoLnZpZGVvVXJsKHNoYXJlLmtleSwgYXNzZXQuaWQpLFxuICAgICAgICAgICAgICB0eXBlOiBhd2FpdCBpbW1pY2guZ2V0Q29udGVudFR5cGUoYXNzZXQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBwcmVsb2FkOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbnRyb2xzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgIG9yaWdpbmFsVXJsOiBpbW1pY2gucGhvdG9Vcmwoc2hhcmUua2V5LCBhc3NldC5pZCksXG4gICAgICAgIHRodW1ibmFpbFVybDogaW1taWNoLnBob3RvVXJsKHNoYXJlLmtleSwgYXNzZXQuaWQsIEltYWdlU2l6ZS50aHVtYm5haWwpLFxuICAgICAgICB2aWRlb1xuICAgICAgfSlcbiAgICB9XG4gICAgcmVzLnJlbmRlcignZ2FsbGVyeScsIHtcbiAgICAgIGl0ZW1zLFxuICAgICAgb3Blbkl0ZW1cbiAgICB9KVxuICB9XG59XG5cbmNvbnN0IHJlbmRlciA9IG5ldyBSZW5kZXIoKVxuXG5leHBvcnQgZGVmYXVsdCByZW5kZXJcbiJdfQ==