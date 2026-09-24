import Foundation
import CoreImage
import CoreImage.CIFilterBuiltins
import CoreGraphics

let destination = "https://workspaceinnovates-ship-it.github.io/Portfolio/"
let outputURL = URL(fileURLWithPath: "exports/RAIKO-Portfolio-QR.svg")

let generator = CIFilter.qrCodeGenerator()
generator.message = Data(destination.utf8)
generator.correctionLevel = "H"

guard let image = generator.outputImage else {
    fatalError("Unable to generate QR code")
}

let extent = image.extent.integral
let width = Int(extent.width)
let height = Int(extent.height)
let context = CIContext(options: [.useSoftwareRenderer: true])
let colorSpace = CGColorSpaceCreateDeviceRGB()
var pixels = [UInt8](repeating: 0, count: width * height * 4)

context.render(
    image,
    toBitmap: &pixels,
    rowBytes: width * 4,
    bounds: extent,
    format: .RGBA8,
    colorSpace: colorSpace
)

let quietZone = 4
let canvasWidth = width + quietZone * 2
let canvasHeight = height + quietZone * 2
var svg = """
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 \(canvasWidth) \(canvasHeight)" role="img" aria-labelledby="title desc" shape-rendering="crispEdges">
  <title id="title">RAIKO portfolio QR code</title>
  <desc id="desc">Scans directly to \(destination)</desc>
  <rect width="\(canvasWidth)" height="\(canvasHeight)" fill="#ffffff"/>
  <g fill="#101110">
"""

for y in 0..<height {
    for x in 0..<width {
        let index = (y * width + x) * 4
        if pixels[index] < 128 {
            svg += "    <rect x=\"\(x + quietZone)\" y=\"\(y + quietZone)\" width=\"1\" height=\"1\"/>\n"
        }
    }
}

svg += "  </g>\n</svg>\n"
try svg.write(to: outputURL, atomically: true, encoding: .utf8)
print("destination=\(destination)")
print("modules=\(width)x\(height)")
print("error_correction=H")
