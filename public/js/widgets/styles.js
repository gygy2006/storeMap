document.addEventListener('DOMContentLoaded', async () => {
  const { onAlertModal } = await import('../utils/utils.js');
  let MAIN_COLOR, ACTIVE_TEXT_COLOR, TEXT_COLOR, DISTANCE_COLOR;

  const getMainColor = () => {
    return document.getElementById('mainColorPickrCt').dataset.color;
  };
  const getTextColor = () => {
    return document.getElementById('uiTextColorCt').dataset.color;
  };
  const getActiveTextColor = () => {
    return document.getElementById('uiActiveTextColorCt').dataset.color;
  };
  const getDistanceColor = () => {
    return getDistanceElm().dataset.color;
  };
  const getDistanceElm = () => {
    return document.getElementById('uiDistanceColorCt');
  };
  const getSubmitBtn = () => {
    return document.getElementById('submitBtn');
  };
  const getTypeSearchStoreElm = () => {
    return document.getElementById('typeSearchStore');
  };
  const getTypeSearchDong = () => {
    return document.getElementById('typeSearchDong');
  };
  const getDistanceElms = () => {
    return document.querySelectorAll('.distance');
  };
  const getMapTitleElm = () => {
    return document.getElementById('mapTitle');
  };
  const getUITypeElms = () => {
    return document.querySelectorAll('.ui_ct input[name="uiType"]');
  };
  const getUIType = () => {
    const uiElms = getUITypeElms();
    for (let i = 0; i < uiElms.length; i++) {
      if (uiElms[i].checked) {
        return uiElms[i].value;
      }
    }
  };

  const initGlobalVariableColor = () => {
    MAIN_COLOR = getMainColor();
    TEXT_COLOR = getTextColor();
    DISTANCE_COLOR = getDistanceColor();
  };

  const createPickr = async () => {
    const pickrComponents = {
      // Main components
      preview: true,
      opacity: true,
      hue: true,

      // Input / output Options
      interaction: {
        hex: true,
        rgba: false,
        hsla: false,
        hsva: false,
        cmyk: false,
        input: true,
        clear: false,
        save: true,
      },
    };

    swatches = [
      'rgba(244, 67, 54, 1)',
      'rgba(233, 30, 99, 0.95)',
      'rgba(156, 39, 176, 0.9)',
      'rgba(103, 58, 183, 0.85)',
      'rgba(63, 81, 181, 0.8)',
      'rgba(33, 150, 243, 0.75)',
      'rgba(3, 169, 244, 0.7)',
      'rgba(0, 188, 212, 0.7)',
      'rgba(0, 150, 136, 0.75)',
      'rgba(76, 175, 80, 0.8)',
      'rgba(139, 195, 74, 0.85)',
      'rgba(205, 220, 57, 0.9)',
      'rgba(255, 235, 59, 0.95)',
      'rgba(255, 193, 7, 1)',
    ];

    // Simple example, see optional options for more configuration.
    const mainUIColorPickr = Pickr.create({
      el: '#uiMainColor',
      theme: 'classic', //'classic' or 'monolith', or 'nano'
      default: getMainColor(),
      swatches: swatches,
      components: pickrComponents,
    });

    const ActiveTextColorPickr = Pickr.create({
      el: '#uiActiveTextColor',
      theme: 'classic', //'classic' or 'monolith', or 'nano'
      default: getActiveTextColor(),
      swatches: swatches,
      components: pickrComponents,
    });

    const TextColorPickr = Pickr.create({
      el: '#uiTextColor',
      theme: 'classic', //'classic' or 'monolith', or 'nano'
      default: getTextColor(),
      swatches: swatches,
      components: pickrComponents,
    });

    const distanceColorPickr = Pickr.create({
      el: '#uiDistanceColor',
      theme: 'classic', //'classic' or 'monolith', or 'nano'
      swatches: swatches,
      default: getDistanceColor(),
      components: pickrComponents,
    });

    mainUIColorPickr.on('save', (color, instance) => {
      const selectedColor = colorToString(color);
      MAIN_COLOR = selectedColor;
      getTypeSearchStoreElm().style.backgroundColor = selectedColor;
      getMapTitleElm().style.backgroundColor = selectedColor;
    });

    ActiveTextColorPickr.on('save', (color, instance) => {
      const selectedColor = colorToString(color);
      ACTIVE_TEXT_COLOR = selectedColor;
      getTypeSearchStoreElm().style.color = selectedColor;
    });

    TextColorPickr.on('save', (color, instance) => {
      const selectedColor = colorToString(color);
      TEXT_COLOR = selectedColor;
      getTypeSearchDong().style.color = selectedColor;
    });

    distanceColorPickr.on('save', (color, instance) => {
      const selectedColor = colorToString(color);
      DISTANCE_COLOR = selectedColor;
      getDistanceElms().forEach((distanceElm) => {
        distanceElm.style.color = selectedColor;
      });
    });
  };
  const colorToString = (color) => {
    return color.toHEXA().toString();
  };

  const setLeftHeight = () => {
    const leftElm = document.querySelector('.left');
    const sections = document.querySelectorAll('.section:not(.displaynone)');
    const sectionStyle = getComputedStyle(sections[1]);
    const sectionMargin =
      parseInt(sectionStyle.margin.split(' ')[0].replaceAll('px')) * 2;
    const sectionHeight = sections[1].clientHeight;

    const height =
      sectionHeight * sections.length + sectionMargin * sections.length;

    leftElm.style.height = height + 'px';
  };

  const onUIType = () => {
    const UIType = getUIType();
    const distanceElms = document.querySelectorAll('#pickupStore .distance');

    if (UIType === 'default') {
      distanceElms.forEach((distanceElm) => {
        distanceElm.classList.add('displaynone');
      });
      getDistanceElm().parentNode.classList.add('displaynone');
    } else {
      distanceElms.forEach((distanceElm) => {
        distanceElm.classList.remove('displaynone');
      });
      getDistanceElm().parentNode.classList.remove('displaynone');
    }

    setLeftHeight();
  };

  const UITypeHandler = () => {
    const UITypeElms = getUITypeElms();
    UITypeElms.forEach((UITypeElm) => {
      UITypeElm.addEventListener('click', onUIType);
    });
  };

  const onSubmit = async () => {
    const form = {
      ui: getUIType(),
      uiColor: MAIN_COLOR,
      activeTextColor: ACTIVE_TEXT_COLOR,
      textColor: TEXT_COLOR,
      distanceColor: DISTANCE_COLOR,
    };

    try {
      const res = await axios.put('/api/widgets/styles', form);
      if (res.status === 200) {
        onAlertModal('성공적으로 저장 되었습니다.');
      }
    } catch (error) {
      console.error(error);
      onAlertModal('저장에 실패하였습니다.');
    }
  };

  const submitBtnHandler = () => {
    getSubmitBtn().addEventListener('click', onSubmit);
  };

  const widgetStyleInit = () => {
    initGlobalVariableColor();
    createPickr();
    submitBtnHandler();
  };

  const reactiveStyles = () => {
    setLeftHeight();
    UITypeHandler();
  };
  const init = () => {
    widgetStyleInit();
    reactiveStyles();
  };

  init();
});
