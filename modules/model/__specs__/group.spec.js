import {fk, many, oneToOne} from 'redux-orm';
import {orm, createReducer} from '../index.ts';
import BaseModel from '../BaseModel.ts';
import {attr} from '../Attr.ts';

class Page extends BaseModel {
  static modelName = 'Page';
  static fields = {};
  static options = {
    idAttribute: 'id'
  };
}
Object.assign(Page.fields, BaseModel.fields, {
  name: attr(),
  width: attr(),
  height: attr(),
  zIndex: attr(),
  background: oneToOne({to: 'Image', as: 'bg'})
});

class Widget extends BaseModel {
  static modelName = 'Widget';
  static fields = {};
  static options = {
    idAttribute: 'id'
  };
}
Object.assign(Widget.fields, BaseModel.fields, {
  name: attr(),
  x: attr(),
  y: attr(),
  width: attr(),
  height: attr(),
  zIndex: attr({
    set: function() {
      console.log('zIndex');
    }
  }),
  pageId: fk({to: 'Page', relatedName: 'widgets'})
});

class DynamicProp extends BaseModel {
  static modelName = 'DynamicProp';
  static fields = {};
  static options = {
    idAttribute: 'id'
  };
}
Object.assign(DynamicProp.fields, BaseModel.fields, {
  name: attr(),
  value: attr(),
  pageId: fk({to: 'Page', relatedName: 'props'}),
  widgetId: fk({to: 'Widget', relatedName: 'props'})
});

class Image extends BaseModel {
  static modelName = 'Image';
  static fields = {};
  static options = {
    idAttribute: 'id'
  };
}

Object.assign(Image.fields, BaseModel.fields, {
  name: attr(),
  url: attr(),
  width: attr(),
  height: attr()
});

orm.register(Page, Widget, DynamicProp, Image);
let session = orm.session({
  Page: {
    items: [],
    itemsById: {},
    meta: {}
  },
  Widget: {
    items: [],
    itemsById: {},
    meta: {}
  },
  DynamicProp: {
    items: [],
    itemsById: {},
    meta: {}
  },
  Image: {
    items: [],
    itemsById: {},
    meta: {}
  }
});

const PageModel = session.Page;
const DynamicPropModel = session.DynamicProp;
const WidgetModel = session.Widget;
const ImageModel = session.Image;

it('new Page', () => {
  const model = PageModel.create({name: '美创大屏'});
  console.log(model);
});

it('add Widget with Page1 ', () => {
  const page = PageModel.create({name: '美创大屏', widht: 1920, height: 1080});
  const model = WidgetModel.create({name: '图表1', pageId: page.id});
  // console.log(model)
  // console.log(PageModel.withId(0).widgets.toModelArray())
});

it('add Widget with Page1 with dynamic ', () => {
  const page = PageModel.create({name: '美创大屏', width: 1920, height: 1080});
  const widget = WidgetModel.create({
    name: '图表1',
    pageId: page.id,
    x: 0,
    y: 100,
    height: 200,
    height: 400
  });
  const widget2 = WidgetModel.create({
    name: '图表2',
    pageId: page.id,
    x: 100,
    y: 80,
    height: 300,
    height: 200
  });
  DynamicPropModel.create({
    name: 'url',
    value: 'http://www.baidu.com',
    pageId: page.id
  });
  DynamicPropModel.create({
    name: 'datasource',
    value: '/capaa/data.action',
    widgetId: widget.id
  });
  console.log(page.props.toModelArray());
  console.log(widget.props.toModelArray());
  const image = ImageModel.create({
    name: '写代码.jpeg',
    url: 'http://xxx.yyy.zzz/code.jpeg',
    width: 100,
    height: 300
  });
  page.update({background: image});
  console.log(PageModel.withId(page.id));
  console.log(PageModel.withId(page.id).background);
});

it('filter data', () => {
  const page = PageModel.create({name: '美创大屏', width: 1920, height: 1080});
  const widget = WidgetModel.create({
    name: '图表1',
    pageId: page.id,
    x: 0,
    y: 100,
    width: 200,
    height: 400
  });
  const widget2 = WidgetModel.create({
    name: '图表2',
    pageId: page.id,
    x: 100,
    y: 80,
    width: 300,
    height: 200
  });

  const image = ImageModel.create({
    name: '写代码.jpeg',
    url: 'http://xxx.yyy.zzz/code.jpeg',
    width: 100,
    height: 300
  });
  page.update({background: image});
  // console.log(page.widgets.tomodelarray())
  // console.log(page.widgets.tomodelarray())

  console.log(page.bg, page.background);

  console.log(
    PageModel.withId(page.id)
      .widgets.filter(w => w.x > 0)
      .toModelArray()
  );
  //@ts-ignore
  console.log(
    PageModel.filter(m => m.background.name == '无bug.gif').toModelArray()
  );
});

it('update case', () => {
  const page = PageModel.create({name: '美创大屏', width: 1920, height: 1080});
  const widget = WidgetModel.create({
    name: '图表1',
    pageId: page.id,
    x: 0,
    y: 100,
    width: 200,
    height: 400
  });
  const widget2 = WidgetModel.create({
    name: '图表2',
    pageId: page.id,
    x: 100,
    y: 80,
    width: 300,
    height: 200
  });
  widget.update({zIndex: 99});
  widget.set('zIndex', 99);
});
