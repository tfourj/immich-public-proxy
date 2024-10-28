"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const immich_1 = tslib_1.__importDefault(require("./immich"));
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const app = (0, express_1.default)();
require('dotenv').config();
app.get('/share/:key', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.params.key.match(/[^\w-]/)) {
        // Invalid characters in the incoming URL
        res.status(404).send();
    }
    else {
        const share = yield immich_1.default.getShareByKey(req.params.key);
        if (((_a = share === null || share === void 0 ? void 0 : share.assets) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            // This is an individual item (not a gallery)
            // Return the full-size image.
            const size = req.query.size === 'thumbnail' ? 'thumbnail' : 'original';
            const image = yield immich_1.default.getImage(share.assets[0].id, size);
            for (const header of ['content-type', 'content-length']) {
                res.set(header, image.headers[header]);
            }
            const data = yield image.arrayBuffer();
            console.log((0, dayjs_1.default)().format() + ' Serving image ' + share.assets[0].id);
            res.send(Buffer.from(data));
        }
        else {
            res.send();
        }
    }
}));
app.listen(3000, () => {
    console.log((0, dayjs_1.default)().format() + ' Server started');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQTZCO0FBQzdCLDhEQUEwQjtBQUMxQiwwREFBeUI7QUFFekIsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUE7QUFFckIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBRTFCLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFOztJQUN4QyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ25DLHlDQUF5QztRQUN6QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3hCLENBQUM7U0FBTSxDQUFDO1FBQ04sTUFBTSxLQUFLLEdBQUcsTUFBTSxnQkFBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JELElBQUksQ0FBQSxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxNQUFNLDBDQUFFLE1BQU0sTUFBSyxDQUFDLEVBQUUsQ0FBQztZQUNoQyw2Q0FBNkM7WUFDN0MsOEJBQThCO1lBQzlCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUE7WUFDdEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxnQkFBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUMxRCxLQUFLLE1BQU0sTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztnQkFDeEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBQ3hDLENBQUM7WUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUEsZUFBSyxHQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN0RSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUM3QixDQUFDO2FBQU0sQ0FBQztZQUNOLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUNaLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUEsZUFBSyxHQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQTtBQUNuRCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgYXBpIGZyb20gJy4vaW1taWNoJ1xuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJ1xuXG5jb25zdCBhcHAgPSBleHByZXNzKClcblxucmVxdWlyZSgnZG90ZW52JykuY29uZmlnKClcblxuYXBwLmdldCgnL3NoYXJlLzprZXknLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgaWYgKHJlcS5wYXJhbXMua2V5Lm1hdGNoKC9bXlxcdy1dLykpIHtcbiAgICAvLyBJbnZhbGlkIGNoYXJhY3RlcnMgaW4gdGhlIGluY29taW5nIFVSTFxuICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKClcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBzaGFyZSA9IGF3YWl0IGFwaS5nZXRTaGFyZUJ5S2V5KHJlcS5wYXJhbXMua2V5KVxuICAgIGlmIChzaGFyZT8uYXNzZXRzPy5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIFRoaXMgaXMgYW4gaW5kaXZpZHVhbCBpdGVtIChub3QgYSBnYWxsZXJ5KVxuICAgICAgLy8gUmV0dXJuIHRoZSBmdWxsLXNpemUgaW1hZ2UuXG4gICAgICBjb25zdCBzaXplID0gcmVxLnF1ZXJ5LnNpemUgPT09ICd0aHVtYm5haWwnID8gJ3RodW1ibmFpbCcgOiAnb3JpZ2luYWwnXG4gICAgICBjb25zdCBpbWFnZSA9IGF3YWl0IGFwaS5nZXRJbWFnZShzaGFyZS5hc3NldHNbMF0uaWQsIHNpemUpXG4gICAgICBmb3IgKGNvbnN0IGhlYWRlciBvZiBbJ2NvbnRlbnQtdHlwZScsICdjb250ZW50LWxlbmd0aCddKSB7XG4gICAgICAgIHJlcy5zZXQoaGVhZGVyLCBpbWFnZS5oZWFkZXJzW2hlYWRlcl0pXG4gICAgICB9XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgaW1hZ2UuYXJyYXlCdWZmZXIoKVxuICAgICAgY29uc29sZS5sb2coZGF5anMoKS5mb3JtYXQoKSArICcgU2VydmluZyBpbWFnZSAnICsgc2hhcmUuYXNzZXRzWzBdLmlkKVxuICAgICAgcmVzLnNlbmQoQnVmZmVyLmZyb20oZGF0YSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zZW5kKClcbiAgICB9XG4gIH1cbn0pXG5cbmFwcC5saXN0ZW4oMzAwMCwgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhkYXlqcygpLmZvcm1hdCgpICsgJyBTZXJ2ZXIgc3RhcnRlZCcpXG59KVxuIl19