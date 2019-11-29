/* eslint-disable no-unused-expressions */
import G6 from '@antv/g6';
// eslint-disable-next-line import/no-unresolved
import { G } from '@antv/g6/types/g';
import { ShapeClassName, ItemState } from '../../common/constants';
import { CustomShape, NodeModel } from '../../common/interfaces';
import { UtilCanvasContext } from '../util';
import { handleAnchor } from '../anchor';

/* 节点固定宽高 */
const keyShapeSize = {
  width: 60,
  height: 60,
};

/* 默认颜色 */
const defaultColor = '#6580EB';

/* 继承节点时的可用配置 */
export interface BizTreeNodeExtendableConfig {
  /* menuIcon展示 */
  showMenuIcon?: boolean;
  /* 节点颜色主题 */
  themeColor?: string;

  drawLabel: (model: NodeModel, group: G.Group) => void;
  drawStatusIcon: (model: NodeModel, group: G.Group) => void;
  setState: (name: ItemState, value: boolean, item: G6.Node) => void;
}

const options: CustomShape<G6.Node, NodeModel> & {
  [property: string]: any;
} & BizTreeNodeExtendableConfig = {
  handleAnchor,
  draw(model, group) {
    this.drawWrapper(model, group);

    const style = {
      fontSize: 60,
      fill: 'black',
      ...model.style,
    };

    const keyShape = group.addShape('text', {
      className: ShapeClassName.KeyShape,
      attrs: {
        width: keyShapeSize.width,
        height: keyShapeSize.height,
        x: keyShapeSize.width / 2,
        y: keyShapeSize.height / 2,
        fontFamily: 'iconfont', // 对应css里面的font-family: "iconfont";
        textAlign: 'center',
        textBaseline: 'middle',
        text: model.text,
        fontSize: model.size,
        ...style,
      },
    });

    this.drawStatusIcon(model, group);
    this.drawLabel(model, group);

    return keyShape;
  },

  afterDraw(model, group) {
    this.alignMenuIcon(group.findByClassName(ShapeClassName.Appendix));
  },

  /* 绘制状态标志 */
  drawStatusIcon(model, group) {
    if (model.statusIconColor) {
      group.addShape('rect', {
        className: ShapeClassName.StatusIcon,
        attrs: {
          width: 14,
          height: 14,
          fill: '#F4F6F8',
          x: 0,
          y: 0,
          radius: [6, 0, 6, 0],
        },
      });

      group.addShape('circle', {
        className: ShapeClassName.StatusIcon,
        attrs: {
          r: 2.5,
          x: 7,
          y: 7,
          fill: typeof model.statusIconColor === 'string' ? model.statusIconColor : defaultColor,
        },
      });
    }
  },

  /* 绘制文本 */
  drawLabel(model: NodeModel, group: G.Group) {
    const label = group.addShape('text', {
      className: ShapeClassName.Label,
      attrs: {
        textAlign: 'center',
        textBaseline: 'middle',
        text: model.label,
        fill: 'black',
        x: keyShapeSize.width / 2,
        y: keyShapeSize.height + 20,
      },
    });
    label.attr('text', this.resetLabelText(label, keyShapeSize.width - 20));
    return label;
  },

  /* 更新 */
  update(model, item) {
    const group = item.getContainer();
    const label = group.findByClassName(ShapeClassName.Label);
    const statusIcon = group.findByClassName(ShapeClassName.StatusIcon);
    label && label.remove(true);
    statusIcon && statusIcon.remove(true);

    this.drawStatusIcon(model, group);
    this.drawLabel(model, group);
  },

  /* 根据尺寸重设节点文本 */
  resetLabelText(label: G.Shape, maxWidth: number, maxLine = 2): string {
    const initialText = label.attr('text');
    if (typeof initialText !== 'string' || initialText === '') return initialText;

    const { fontWeight, fontFamily, fontSize, fontStyle, fontVariant } = label.attr();
    const initialFont = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`;
    const CanvasContext = UtilCanvasContext as CanvasRenderingContext2D;
    CanvasContext.font = initialFont;
    const ellipsisWidth = CanvasContext.measureText('...').width;

    // 储存所有文本行
    const lines = [];
    let tempStr = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < initialText.length; i++) {
      const char = initialText[i];
      tempStr += char;

      // 匹配到换行符
      if (/\n/.test(char) || /\r/.test(char)) {
        lines.push(tempStr.trim());
        tempStr = '';
      }

      // 文本超宽
      if (CanvasContext.measureText(tempStr).width > maxWidth) {
        lines.push(tempStr.substring(0, tempStr.length - 1));
        tempStr = char;
      }

      // 最后一个字符
      if (i === initialText.length - 1) {
        lines.push(tempStr);
      }
    }
    const lastLine = lines[maxLine - 1];
    // 总行数不大于maxLine，则直接返回
    if (lines.length <= maxLine) {
      return lines
        .slice(0, maxLine)
        .join('\n')
        .trim();
    }

    // 添加省略号
    let newLastLine = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const char of lastLine) {
      if (CanvasContext.measureText(newLastLine + char).width < maxWidth - ellipsisWidth) {
        newLastLine += char;
      }
    }

    return lines
      .slice(0, maxLine - 1)
      .concat(`${newLastLine}...`)
      .join('\n');
  },

  /* 调整menuIcon位置 */
  alignMenuIcon(icon: G.Shape) {
    icon && icon.attr('x', keyShapeSize.width - icon.getBBox().width);
  },

  /* 绘制包围层 */
  drawWrapper(model: NodeModel, group: G.Group): G.Shape {
    return group.addShape('rect', {
      className: ShapeClassName.Wrapper,
      attrs: this[`get${ShapeClassName.Wrapper}defaultStyle`](),
    });
  },

  /* 设置包围层状态样式 */
  setWrapperStateStyle(state: ItemState & 'default', wrapper: G.Shape) {
    return wrapper.attr(this[`get${ShapeClassName.Wrapper}${state}Style`]());
  },

  /* 设置状态 */
  setState(name, value, item) {
    // 根据状态绘制锚点
    this.handleAnchor.call(this, name, value, item);
    const wrapper = item.getContainer().findByClassName(ShapeClassName.Wrapper);

    if (item.getStates().includes(ItemState.Selected)) {
      return this.setWrapperStateStyle(ItemState.Selected, wrapper);
    }

    return this.setWrapperStateStyle('default', wrapper);
  },

  /* 锚点 */
  getAnchorPoints(model: NodeModel) {
    if (Array.isArray(model.anchorPoints)) {
      return model.anchorPoints;
    }
    return [[0, 0.5], [1, 0.5], [0.5, 0], [0.5, 1]];
  },

  [`get${ShapeClassName.Wrapper}defaultStyle`]() {
    return {
      width: keyShapeSize.width,
      height: keyShapeSize.height,
      x: 0,
      y: 0,
      stroke: 'rgba(0, 0, 0, 0)',
      radius: 8,
      shadowBlur: 25,
    };
  },

  [`get${ShapeClassName.Wrapper}selectedStyle`]() {
    return {
      width: keyShapeSize.width + 4,
      height: keyShapeSize.height + 4,
      x: -2,
      y: -2,
      stroke: this.themeColor || defaultColor,
      // radius: 8,
      // shadowBlur: 25,
      // shadowColor: '#ccc',
    };
  },

  [`get${ShapeClassName.Anchor}defaultStyle`]() {
    return {
      stroke: this.themeColor || defaultColor,
      lineWidth: 2,
      fill: '#fff',
      r: 4,
    };
  },
};

G6.registerNode('icon-node', options);
