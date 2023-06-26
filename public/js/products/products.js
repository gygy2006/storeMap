window.addEventListener('DOMContentLoaded', async () => {
  const utils = await import('../utils/utils.js');
  let L_PRODUCTS_LIST = [];

  let mallId = sessionStorage.getItem('mall_id');

  const getPrdCntElm = () => {
    return document.getElementById('prdCnt');
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(`/api/products/${mallId}`);
      if (res.status === 200) {
        L_PRODUCTS_LIST = res.data;
        getPrdCntElm().innerText = L_PRODUCTS_LIST.length;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const paintProducts = () => {
    let index = 1;
    const productsElm = document.getElementById('products');

    if (L_PRODUCTS_LIST.length > 0) {
      for (let key in L_PRODUCTS_LIST) {
        const productHTML =
          `<div class="product">` +
          `  <div class="prd_no">${L_PRODUCTS_LIST[key].product_no}</div>` +
          `  <div class="prd_img">` +
          `    <img` +
          `      src="${L_PRODUCTS_LIST[key].detail_image}"` +
          `      alt=""` +
          `    />` +
          `  </div>` +
          `  <div class="name">${L_PRODUCTS_LIST[key].product_name}</div>` +
          `  <div class="prd_price">${L_PRODUCTS_LIST[key].price}</div>` +
          `  <div class="use_status switch_ct">` +
          `    <div>` +
          `      <div>` +
          `        <input class="switch_input" id="useStatus_${L_PRODUCTS_LIST[key].product_no}" data-product-id=${L_PRODUCTS_LIST[key].product_no} type="checkbox" />` +
          `        <label class="switch_label" for="useStatus_${L_PRODUCTS_LIST[key].product_no}"></label>` +
          `      </div>` +
          `    </div>` +
          `  </div>` +
          `</div>`;
        productsElm.innerHTML += productHTML;
        index++;
      }
    } else {
      const emptyStoreElm =
        `<div class="emtpy_product_ct">` +
        ` <div class="emtpy_product">` +
        `   <img src="/icons/empty_box.svg" alt="빈상자 아이콘">` +
        `   <span>등록된 상품이 존재하지 않습니다.</span>` +
        ` </div>` +
        `</div>`;

      productsElm.innerHTML += emptyStoreElm;
    }
  };

  const setUsingPrd = (products) => {
    products.forEach(async (product) => {
      const getSwitchElm = document.querySelector(
        `.use_status input[id=useStatus_${product.productId}]`
      );
      if (getSwitchElm) {
        getSwitchElm.checked = true;
      } else {
        try {
          const res = await axios.delete(
            `/products/product/${product.productId}`
          );
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const getUsingProducts = async () => {
    try {
      const res = await axios.get('/api/products/use_status');
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const usingProductInit = async () => {
    const products = await getUsingProducts();
    if (products.length > 0) {
      setUsingPrd(products);
    }
  };

  const onUseStatus = async (useStatusElm) => {
    const loadingGuard = utils.createLoadingGaurd();
    utils.paintLoadingGuard(loadingGuard);
    try {
      const productId = useStatusElm.dataset.productId;
      const useStatus = useStatusElm.checked;
      const form = {
        productId: productId,
        useStatus: useStatus,
      };

      const res = await axios.post(
        `/api/products/product/${mallId}/option`,
        form
      );

      if (res.status === 201) {
        setTimeout(() => {
          utils.removeLoadingGuard(loadingGuard);
          utils.onAlertModal('설정이 완료되었습니다.');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      utils.removeLoadingGuard(loadingGuard);
    }
  };

  const useStatusHandler = () => {
    const useStatusElms = document.querySelectorAll(
      '.use_status .switch_input'
    );

    useStatusElms.forEach((useStatusElm) => {
      useStatusElm.addEventListener('input', () => {
        onUseStatus(useStatusElm);
      });
    });
  };

  const init = async () => {
    if (!mallId) {
      mallId = 'rlagudtjq2016';
    }
    await getProducts();
    paintProducts();
    usingProductInit();
    useStatusHandler();
  };

  init();
});
