interface WebcamFrameProps {
  width: number;
  height: number;
  offset?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  proportion?: number;
}

const defaultProps: WebcamFrameProps = {
  width: 0,
  height: 0,
  offset: {
    top: 20,
    right: 20,
    bottom: 180,
    left: 20,
  },
  proportion: Math.sqrt(2),
};

export function getFrame(props: WebcamFrameProps) {
  const {
    width = defaultProps.width,
    height = defaultProps.height,
    offset = defaultProps.offset,
    proportion = defaultProps.proportion,
  } = props || {};

  // available area
  const W = width - offset!.left - offset!.right;
  const H = height - offset!.top - offset!.bottom;
  //const orientation = W < H ? "portrait" : "landscape";
  const orientation = "portrait";

  // maximum dimensions
  const maxW = W < H ? Math.min(W, H / proportion!) : H / proportion!;
  const maxH = W < H ? Math.min(W * proportion!, H) : H;

  // scale
  const scaledW = orientation === "portrait" ? maxW : maxH;
  const scaledH = orientation === "portrait" ? maxH : maxW;

  return {
    x: (width - offset!.left - scaledW - offset!.right) / 2,
    y: offset!.top + (H - scaledH) / 2,
    width: scaledW,
    height: scaledH,
    orientation,
  };
}

export function WebcamFrameA4(props: WebcamFrameProps) {
  const { y, width, height } = getFrame(props);

  return (
    <div
      className="z-1 absolute left-1/2 -translate-x-1/2 transform"
      style={{ top: y }}
    >
      <div className={`border-4 border-white`} style={{ width, height }} />
    </div>
  );
}
