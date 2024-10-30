"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("./types");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const index_1 = require("./index");
class Immich {
    /**
     * Make a request to Immich API. We're not using the SDK to limit
     * the possible attack surface of this app.
     */
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
    /**
     * Query Immich for the SharedLink metadata for a given key.
     * The key is what is returned in the URL when you create a share in Immich.
     *
     * Immich doesn't have a method to query by key, so this method gets all
     * known shared links, and returns the link which matches the provided key.
     */
    getShareByKey(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = ((yield this.request('/shared-links')) || []);
            const link = res.find(x => x.key === key);
            if (link) {
                // Filter assets to exclude trashed assets
                link.assets = link.assets.filter(x => !x.isTrashed);
                if (link.expiresAt && (0, dayjs_1.default)(link.expiresAt) < (0, dayjs_1.default)()) {
                    // This link has expired
                    (0, index_1.log)('Expired link ' + key);
                }
                else {
                    return link;
                }
            }
        });
    }
    /**
     * Stream asset buffer data from Immich.
     *
     * For photos, you can request 'thumbnail' or 'original' size.
     * For videos, it is Immich's streaming quality, not the original quality.
     */
    getAssetBuffer(asset, size) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (asset.type) {
                case types_1.AssetType.image:
                    size = size === types_1.ImageSize.thumbnail ? types_1.ImageSize.thumbnail : types_1.ImageSize.original;
                    return this.request('/assets/' + encodeURIComponent(asset.id) + '/' + size);
                case types_1.AssetType.video:
                    return this.request('/assets/' + encodeURIComponent(asset.id) + '/video/playback');
            }
        });
    }
    /**
     * Get the content-type of an Immich asset
     */
    getContentType(asset) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const assetBuffer = yield this.getAssetBuffer(asset);
            return assetBuffer.headers.get('Content-Type');
        });
    }
    /**
     * Return the image data URL for a photo
     */
    photoUrl(key, id, size) {
        return `/photo/${key}/${id}` + (size ? `?size=${size}` : '');
    }
    /**
     * Return the video data URL for a video
     */
    videoUrl(key, id) {
        return `/video/${key}/${id}`;
    }
    /**
     * Check if a provided ID matches the Immich ID format
     */
    isId(id) {
        return !!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    }
    /**
     * Check if a provided key matches the Immich shared-link key format
     */
    isKey(key) {
        return !!key.match(/^[\w-]+$/);
    }
}
const immich = new Immich();
exports.default = immich;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1taWNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ltbWljaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUU7QUFDakUsMERBQXlCO0FBQ3pCLG1DQUE2QjtBQUU3QixNQUFNLE1BQU07SUFDVjs7O09BR0c7SUFDRyxPQUFPLENBQUUsUUFBZ0I7O1lBQzdCLE1BQU0sR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLE1BQU0sR0FBRyxRQUFRLEVBQUU7Z0JBQ2xFLE9BQU8sRUFBRTtvQkFDUCxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksRUFBRTtpQkFDdkM7YUFDRixDQUFDLENBQUE7WUFDRixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtnQkFDekQsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQztvQkFDN0MsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ25CLENBQUM7cUJBQU0sQ0FBQztvQkFDTixPQUFPLEdBQUcsQ0FBQTtnQkFDWixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNHLGFBQWEsQ0FBRSxHQUFXOztZQUM5QixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUEsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFJLEVBQUUsQ0FBaUIsQ0FBQTtZQUN2RSxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQTtZQUN6QyxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNULDBDQUEwQztnQkFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUNuRCxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBQSxlQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUEsZUFBSyxHQUFFLEVBQUUsQ0FBQztvQkFDdEQsd0JBQXdCO29CQUN4QixJQUFBLFdBQUcsRUFBQyxlQUFlLEdBQUcsR0FBRyxDQUFDLENBQUE7Z0JBQzVCLENBQUM7cUJBQU0sQ0FBQztvQkFDTixPQUFPLElBQUksQ0FBQTtnQkFDYixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVEOzs7OztPQUtHO0lBQ0csY0FBYyxDQUFFLEtBQVksRUFBRSxJQUFnQjs7WUFDbEQsUUFBUSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ25CLEtBQUssaUJBQVMsQ0FBQyxLQUFLO29CQUNsQixJQUFJLEdBQUcsSUFBSSxLQUFLLGlCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQVMsQ0FBQyxRQUFRLENBQUE7b0JBQzlFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQTtnQkFDN0UsS0FBSyxpQkFBUyxDQUFDLEtBQUs7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUE7WUFDdEYsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0csY0FBYyxDQUFFLEtBQVk7O1lBQ2hDLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNwRCxPQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ2hELENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0gsUUFBUSxDQUFFLEdBQVcsRUFBRSxFQUFVLEVBQUUsSUFBZ0I7UUFDakQsT0FBTyxVQUFVLEdBQUcsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDOUQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUSxDQUFFLEdBQVcsRUFBRSxFQUFVO1FBQy9CLE9BQU8sVUFBVSxHQUFHLElBQUksRUFBRSxFQUFFLENBQUE7SUFDOUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxDQUFFLEVBQVU7UUFDZCxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUE7SUFDckYsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFFLEdBQVc7UUFDaEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO0FBRTNCLGtCQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzc2V0LCBBc3NldFR5cGUsIEltYWdlU2l6ZSwgU2hhcmVkTGluayB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuL2luZGV4J1xuXG5jbGFzcyBJbW1pY2gge1xuICAvKipcbiAgICogTWFrZSBhIHJlcXVlc3QgdG8gSW1taWNoIEFQSS4gV2UncmUgbm90IHVzaW5nIHRoZSBTREsgdG8gbGltaXRcbiAgICogdGhlIHBvc3NpYmxlIGF0dGFjayBzdXJmYWNlIG9mIHRoaXMgYXBwLlxuICAgKi9cbiAgYXN5bmMgcmVxdWVzdCAoZW5kcG9pbnQ6IHN0cmluZykge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHByb2Nlc3MuZW52LklNTUlDSF9VUkwgKyAnL2FwaScgKyBlbmRwb2ludCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAneC1hcGkta2V5JzogcHJvY2Vzcy5lbnYuQVBJX0tFWSB8fCAnJ1xuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpIHx8ICcnXG4gICAgICBpZiAoY29udGVudFR5cGUuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgICByZXR1cm4gcmVzLmpzb24oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyeSBJbW1pY2ggZm9yIHRoZSBTaGFyZWRMaW5rIG1ldGFkYXRhIGZvciBhIGdpdmVuIGtleS5cbiAgICogVGhlIGtleSBpcyB3aGF0IGlzIHJldHVybmVkIGluIHRoZSBVUkwgd2hlbiB5b3UgY3JlYXRlIGEgc2hhcmUgaW4gSW1taWNoLlxuICAgKlxuICAgKiBJbW1pY2ggZG9lc24ndCBoYXZlIGEgbWV0aG9kIHRvIHF1ZXJ5IGJ5IGtleSwgc28gdGhpcyBtZXRob2QgZ2V0cyBhbGxcbiAgICoga25vd24gc2hhcmVkIGxpbmtzLCBhbmQgcmV0dXJucyB0aGUgbGluayB3aGljaCBtYXRjaGVzIHRoZSBwcm92aWRlZCBrZXkuXG4gICAqL1xuICBhc3luYyBnZXRTaGFyZUJ5S2V5IChrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IHJlcyA9IChhd2FpdCB0aGlzLnJlcXVlc3QoJy9zaGFyZWQtbGlua3MnKSB8fCBbXSkgYXMgU2hhcmVkTGlua1tdXG4gICAgY29uc3QgbGluayA9IHJlcy5maW5kKHggPT4geC5rZXkgPT09IGtleSlcbiAgICBpZiAobGluaykge1xuICAgICAgLy8gRmlsdGVyIGFzc2V0cyB0byBleGNsdWRlIHRyYXNoZWQgYXNzZXRzXG4gICAgICBsaW5rLmFzc2V0cyA9IGxpbmsuYXNzZXRzLmZpbHRlcih4ID0+ICF4LmlzVHJhc2hlZClcbiAgICAgIGlmIChsaW5rLmV4cGlyZXNBdCAmJiBkYXlqcyhsaW5rLmV4cGlyZXNBdCkgPCBkYXlqcygpKSB7XG4gICAgICAgIC8vIFRoaXMgbGluayBoYXMgZXhwaXJlZFxuICAgICAgICBsb2coJ0V4cGlyZWQgbGluayAnICsga2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxpbmtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RyZWFtIGFzc2V0IGJ1ZmZlciBkYXRhIGZyb20gSW1taWNoLlxuICAgKlxuICAgKiBGb3IgcGhvdG9zLCB5b3UgY2FuIHJlcXVlc3QgJ3RodW1ibmFpbCcgb3IgJ29yaWdpbmFsJyBzaXplLlxuICAgKiBGb3IgdmlkZW9zLCBpdCBpcyBJbW1pY2gncyBzdHJlYW1pbmcgcXVhbGl0eSwgbm90IHRoZSBvcmlnaW5hbCBxdWFsaXR5LlxuICAgKi9cbiAgYXN5bmMgZ2V0QXNzZXRCdWZmZXIgKGFzc2V0OiBBc3NldCwgc2l6ZT86IEltYWdlU2l6ZSkge1xuICAgIHN3aXRjaCAoYXNzZXQudHlwZSkge1xuICAgICAgY2FzZSBBc3NldFR5cGUuaW1hZ2U6XG4gICAgICAgIHNpemUgPSBzaXplID09PSBJbWFnZVNpemUudGh1bWJuYWlsID8gSW1hZ2VTaXplLnRodW1ibmFpbCA6IEltYWdlU2l6ZS5vcmlnaW5hbFxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoYXNzZXQuaWQpICsgJy8nICsgc2l6ZSlcbiAgICAgIGNhc2UgQXNzZXRUeXBlLnZpZGVvOlxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCcvYXNzZXRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoYXNzZXQuaWQpICsgJy92aWRlby9wbGF5YmFjaycpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29udGVudC10eXBlIG9mIGFuIEltbWljaCBhc3NldFxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udGVudFR5cGUgKGFzc2V0OiBBc3NldCkge1xuICAgIGNvbnN0IGFzc2V0QnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBc3NldEJ1ZmZlcihhc3NldClcbiAgICByZXR1cm4gYXNzZXRCdWZmZXIuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbWFnZSBkYXRhIFVSTCBmb3IgYSBwaG90b1xuICAgKi9cbiAgcGhvdG9VcmwgKGtleTogc3RyaW5nLCBpZDogc3RyaW5nLCBzaXplPzogSW1hZ2VTaXplKSB7XG4gICAgcmV0dXJuIGAvcGhvdG8vJHtrZXl9LyR7aWR9YCArIChzaXplID8gYD9zaXplPSR7c2l6ZX1gIDogJycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB2aWRlbyBkYXRhIFVSTCBmb3IgYSB2aWRlb1xuICAgKi9cbiAgdmlkZW9VcmwgKGtleTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAvdmlkZW8vJHtrZXl9LyR7aWR9YFxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgcHJvdmlkZWQgSUQgbWF0Y2hlcyB0aGUgSW1taWNoIElEIGZvcm1hdFxuICAgKi9cbiAgaXNJZCAoaWQ6IHN0cmluZykge1xuICAgIHJldHVybiAhIWlkLm1hdGNoKC9eWzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzAtOWEtZl17NH0tWzAtOWEtZl17NH0tWzAtOWEtZl17MTJ9JC8pXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBwcm92aWRlZCBrZXkgbWF0Y2hlcyB0aGUgSW1taWNoIHNoYXJlZC1saW5rIGtleSBmb3JtYXRcbiAgICovXG4gIGlzS2V5IChrZXk6IHN0cmluZykge1xuICAgIHJldHVybiAhIWtleS5tYXRjaCgvXltcXHctXSskLylcbiAgfVxufVxuXG5jb25zdCBpbW1pY2ggPSBuZXcgSW1taWNoKClcblxuZXhwb3J0IGRlZmF1bHQgaW1taWNoXG4iXX0=