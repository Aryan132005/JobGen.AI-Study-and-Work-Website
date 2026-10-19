import os
import re
import sys
from http import HTTPStatus
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get('PORT', 8085))

class RangeFile:
    def __init__(self, f, length):
        self.f = f
        self.remaining = length

    def read(self, size=-1):
        if self.remaining <= 0:
            return b""
        if size < 0 or size > self.remaining:
            size = self.remaining
        data = self.f.read(size)
        self.remaining -= len(data)
        return data

    def close(self):
        self.f.close()

class RangeHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, BrokenPipeError):
            pass

    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write("%s - - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format%args))

    def send_head(self):
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = os.path.split(self.path)
            if not self.path.endswith('/'):
                self.send_response(HTTPStatus.MOVED_PERMANENTLY)
                new_parts = (parts[0], parts[1] + '/')
                new_path = "/".join(new_parts)
                self.send_header("Location", new_path)
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return self.list_directory(path)
        
        if not os.path.exists(path):
            # Check if asset path contains www.studyandwork.com.au
            if 'www.studyandwork.com.au' in self.path:
                sw_subpath = self.path[self.path.find('www.studyandwork.com.au'):]
                sw_full = os.path.join(os.getcwd(), sw_subpath)
                if os.path.isfile(sw_full):
                    path = sw_full
            if not os.path.exists(path):
                # Check if asset exists in root (e.g. /candidates/v1.mp4 -> ./v1.mp4)
                base_asset = os.path.join(os.getcwd(), os.path.basename(path))
                if os.path.isfile(base_asset):
                    path = base_asset
                elif not os.path.splitext(path)[1] or self.path.startswith(('/candidates', '/employers', '/education-providers', '/internship', '/job-placement', '/casual-jobs', '/staffing', '/about', '/contact', '/resources', '/alumni', '/our-alumni')):
                    # Fallback to index.html for Single Page Application routing
                    path = os.path.join(os.getcwd(), 'index.html')

        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return None

        try:
            fs = os.fstat(f.fileno())
            size = fs[6]

            # Parse Range header for seeking video/audio
            range_header = self.headers.get('Range')
            if range_header:
                m = re.match(r'bytes=(\d+)-(\d*)', range_header)
                if m:
                    start = int(m.group(1))
                    end = int(m.group(2)) if m.group(2) else size - 1
                    if start < size and start <= end:
                        end = min(end, size - 1)
                        content_length = end - start + 1

                        self.send_response(HTTPStatus.PARTIAL_CONTENT)
                        self.send_header("Content-Type", ctype)
                        self.send_header("Content-Length", str(content_length))
                        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                        self.send_header("Accept-Ranges", "bytes")
                        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
                        self.end_headers()

                        f.seek(start)
                        return RangeFile(f, content_length)

            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(size))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f
        except Exception:
            f.close()
            raise

class QuietHTTPServer(HTTPServer):
    def handle_error(self, request, client_address):
        # Ignore client disconnects when video seeks or buffers
        pass

def run():
    server_address = ('', PORT)
    httpd = QuietHTTPServer(server_address, RangeHTTPRequestHandler)
    print(f"Serving HTTP with Byte-Range seeking support on port {PORT} (http://localhost:{PORT}/)...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == '__main__':
    run()
