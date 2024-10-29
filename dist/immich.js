"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("./types");
class Immich {
    request(endpoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(process.env.IMMICH_URL + '/api' + endpoint, {
                headers: {
                    'x-api-key': process.env.API_KEY || ''
                }
            });
            if (res.status === 200) {
                const contentType = res.headers.get('Content-Type') || '';
                if (contentType.includes('application/json')) {
                    return res.json();
                }
                else {
                    return res;
                }
            }
        });
    }
    getShareByKey(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = ((yield this.request('/shared-links')) || []);
            return res === null || res === void 0 ? void 0 : res.find(x => x.key === key);
        });
    }
    getAssetBuffer(asset, size) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (asset.type) {
                case types_1.AssetType.image:
                    size = size === types_1.ImageSize.thumbnail ? types_1.ImageSize.thumbnail : types_1.ImageSize.original;
                    return this.request('/assets/' + asset.id + '/' + size);
                case types_1.AssetType.video:
                    return this.request('/assets/' + asset.id + '/video/playback');
            }
        });
    }
    getContentType(asset) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const assetBuffer = yield this.getAssetBuffer(asset);
            return assetBuffer.headers.get('Content-Type');
        });
    }
    photoUrl(id, size) {
        return `${process.env.SERVER_URL}/photo/${id}` + (size ? `?size=${size}` : '');
    }
    videoUrl(id) {
        return `${process.env.SERVER_URL}/video/${id}`;
    }
    isId(id) {
        return !!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    }
}
const immich = new Immich();
exports.default = immich;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUU7QUFFakUsTUFBTSxNQUFNO0lBQ0osT0FBTyxDQUFFLFFBQWdCOztZQUM3QixNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxNQUFNLEdBQUcsUUFBUSxFQUFFO2dCQUNsRSxPQUFPLEVBQUU7b0JBQ1AsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUU7aUJBQ3ZDO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUN2QixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ3pELElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUM7b0JBQzdDLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUNuQixDQUFDO3FCQUFNLENBQUM7b0JBQ04sT0FBTyxHQUFHLENBQUE7Z0JBQ1osQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFSyxhQUFhLENBQUUsR0FBVzs7WUFDOUIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFBLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSSxFQUFFLENBQWlCLENBQUE7WUFDdkUsT0FBTyxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQTtRQUN0QyxDQUFDO0tBQUE7SUFFSyxjQUFjLENBQUUsS0FBWSxFQUFFLElBQWdCOztZQUNsRCxRQUFRLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkIsS0FBSyxpQkFBUyxDQUFDLEtBQUs7b0JBQ2xCLElBQUksR0FBRyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBUyxDQUFDLFFBQVEsQ0FBQTtvQkFDOUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQTtnQkFDekQsS0FBSyxpQkFBUyxDQUFDLEtBQUs7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFBO1lBQ2xFLENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFSyxjQUFjLENBQUUsS0FBWTs7WUFDaEMsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3BELE9BQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDaEQsQ0FBQztLQUFBO0lBRUQsUUFBUSxDQUFFLEVBQVUsRUFBRSxJQUFnQjtRQUNwQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLFVBQVUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ2hGLENBQUM7SUFFRCxRQUFRLENBQUUsRUFBVTtRQUNsQixPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLFVBQVUsRUFBRSxFQUFFLENBQUE7SUFDaEQsQ0FBQztJQUVELElBQUksQ0FBRSxFQUFVO1FBQ2QsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFBO0lBQ3JGLENBQUM7Q0FDRjtBQUVELE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUE7QUFFM0Isa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXNzZXQsIEFzc2V0VHlwZSwgSW1hZ2VTaXplLCBTaGFyZWRMaW5rIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgSW1taWNoIHtcbiAgYXN5bmMgcmVxdWVzdCAoZW5kcG9pbnQ6IHN0cmluZykge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHByb2Nlc3MuZW52LklNTUlDSF9VUkwgKyAnL2FwaScgKyBlbmRwb2ludCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAneC1hcGkta2V5JzogcHJvY2Vzcy5lbnYuQVBJX0tFWSB8fCAnJ1xuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpIHx8ICcnXG4gICAgICBpZiAoY29udGVudFR5cGUuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgICByZXR1cm4gcmVzLmpzb24oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldFNoYXJlQnlLZXkgKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzID0gKGF3YWl0IHRoaXMucmVxdWVzdCgnL3NoYXJlZC1saW5rcycpIHx8IFtdKSBhcyBTaGFyZWRMaW5rW11cbiAgICByZXR1cm4gcmVzPy5maW5kKHggPT4geC5rZXkgPT09IGtleSlcbiAgfVxuXG4gIGFzeW5jIGdldEFzc2V0QnVmZmVyIChhc3NldDogQXNzZXQsIHNpemU/OiBJbWFnZVNpemUpIHtcbiAgICBzd2l0Y2ggKGFzc2V0LnR5cGUpIHtcbiAgICAgIGNhc2UgQXNzZXRUeXBlLmltYWdlOlxuICAgICAgICBzaXplID0gc2l6ZSA9PT0gSW1hZ2VTaXplLnRodW1ibmFpbCA/IEltYWdlU2l6ZS50aHVtYm5haWwgOiBJbWFnZVNpemUub3JpZ2luYWxcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnL2Fzc2V0cy8nICsgYXNzZXQuaWQgKyAnLycgKyBzaXplKVxuICAgICAgY2FzZSBBc3NldFR5cGUudmlkZW86XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJy9hc3NldHMvJyArIGFzc2V0LmlkICsgJy92aWRlby9wbGF5YmFjaycpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0Q29udGVudFR5cGUgKGFzc2V0OiBBc3NldCkge1xuICAgIGNvbnN0IGFzc2V0QnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBc3NldEJ1ZmZlcihhc3NldClcbiAgICByZXR1cm4gYXNzZXRCdWZmZXIuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpXG4gIH1cblxuICBwaG90b1VybCAoaWQ6IHN0cmluZywgc2l6ZT86IEltYWdlU2l6ZSkge1xuICAgIHJldHVybiBgJHtwcm9jZXNzLmVudi5TRVJWRVJfVVJMfS9waG90by8ke2lkfWAgKyAoc2l6ZSA/IGA/c2l6ZT0ke3NpemV9YCA6ICcnKVxuICB9XG5cbiAgdmlkZW9VcmwgKGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7cHJvY2Vzcy5lbnYuU0VSVkVSX1VSTH0vdmlkZW8vJHtpZH1gXG4gIH1cblxuICBpc0lkIChpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuICEhaWQubWF0Y2goL15bMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXsxMn0kLylcbiAgfVxufVxuXG5jb25zdCBpbW1pY2ggPSBuZXcgSW1taWNoKClcblxuZXhwb3J0IGRlZmF1bHQgaW1taWNoXG4iXX0=