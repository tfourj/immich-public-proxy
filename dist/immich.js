"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class Immich {
    request(endpoint_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (endpoint, json = true) {
            const res = yield fetch(process.env.IMMICH_URL + '/api' + endpoint, {
                headers: {
                    'x-api-key': process.env.API_KEY || ''
                }
            });
            if (json) {
                return res.json();
            }
            else {
                return res;
            }
        });
    }
    getShareByKey(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const links = yield this.request('/shared-links');
            return links.find(x => x.key === key);
        });
    }
    getImage(id_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (id, size = 'original') {
            size = size === 'thumbnail' ? 'thumbnail' : 'original';
            return this.request('/assets/' + id + '/' + size, false);
        });
    }
}
const api = new Immich();
exports.default = api;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFNLE1BQU07SUFDSixPQUFPO3FFQUFFLFFBQWdCLEVBQUUsSUFBSSxHQUFHLElBQUk7WUFDMUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxHQUFHLFFBQVEsRUFBRTtnQkFDbEUsT0FBTyxFQUFFO29CQUNQLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxFQUFFO2lCQUN2QzthQUNGLENBQUMsQ0FBQTtZQUNGLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ1QsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDbkIsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE9BQU8sR0FBRyxDQUFBO1lBQ1osQ0FBQztRQUNILENBQUM7S0FBQTtJQUVLLGFBQWEsQ0FBRSxHQUFXOztZQUM5QixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFpQixDQUFBO1lBQ2pFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUE7UUFDdkMsQ0FBQztLQUFBO0lBRUssUUFBUTtxRUFBRSxFQUFVLEVBQUUsSUFBSSxHQUFHLFVBQVU7WUFDM0MsSUFBSSxHQUFHLElBQUksS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFBO1lBQ3RELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDMUQsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO0FBRXhCLGtCQUFlLEdBQUcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNoYXJlZExpbmsgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBJbW1pY2gge1xuICBhc3luYyByZXF1ZXN0IChlbmRwb2ludDogc3RyaW5nLCBqc29uID0gdHJ1ZSkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHByb2Nlc3MuZW52LklNTUlDSF9VUkwgKyAnL2FwaScgKyBlbmRwb2ludCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAneC1hcGkta2V5JzogcHJvY2Vzcy5lbnYuQVBJX0tFWSB8fCAnJ1xuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKGpzb24pIHtcbiAgICAgIHJldHVybiByZXMuanNvbigpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXNcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRTaGFyZUJ5S2V5IChrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGxpbmtzID0gYXdhaXQgdGhpcy5yZXF1ZXN0KCcvc2hhcmVkLWxpbmtzJykgYXMgU2hhcmVkTGlua1tdXG4gICAgcmV0dXJuIGxpbmtzLmZpbmQoeCA9PiB4LmtleSA9PT0ga2V5KVxuICB9XG5cbiAgYXN5bmMgZ2V0SW1hZ2UgKGlkOiBzdHJpbmcsIHNpemUgPSAnb3JpZ2luYWwnKSB7XG4gICAgc2l6ZSA9IHNpemUgPT09ICd0aHVtYm5haWwnID8gJ3RodW1ibmFpbCcgOiAnb3JpZ2luYWwnXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnL2Fzc2V0cy8nICsgaWQgKyAnLycgKyBzaXplLCBmYWxzZSlcbiAgfVxufVxuXG5jb25zdCBhcGkgPSBuZXcgSW1taWNoKClcblxuZXhwb3J0IGRlZmF1bHQgYXBpXG4iXX0=