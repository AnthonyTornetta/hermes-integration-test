"""Reproduce the fixed 24x12 opaque PNG used by both fixture applications."""
from pathlib import Path
import struct
import zlib


def png():
    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))
    pixels = b''.join(b'\0' + b''.join(bytes((32 + x * 8, 48 + y * 12, 160)) for x in range(24)) for y in range(12))
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', 24, 12, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(pixels, 9)) + chunk(b'IEND', b''))


if __name__ == '__main__':
    root = Path(__file__).resolve().parent.parent
    for prefix in (Path('.'), Path('apps/site')):
        (root / prefix / 'static/fixture.png').write_bytes(png())
