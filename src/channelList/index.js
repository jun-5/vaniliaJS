import "../style.css";
import { setupChannelListHandlers } from "./channelList.js";

// 채널 리스트 모듈 초기화
const channelListContainer = document.querySelector("#channelList");

console.log(channelListContainer);

if (channelListContainer) {
  channelListContainer.innerHTML = `
    <div>
      <h3>Channel List 
        <span style="font-size: 14px; color: #999; font-weight: normal;">
          (Debounce & Throttle 적용 예제)
        </span>
      </h3>
      <div class="card">
        <div class="channel-list-section">
          <input type="text" id="channel-input" placeholder="채널 이름을 입력하세요...">
          <button id="add-channel-btn">추가</button>
        </div>
        <div class="channel-list-section" style="margin-top: 10px;">
          <input 
            type="text" 
            id="channel-search-input" 
            placeholder="🔍 실시간 검색 (debounce 300ms)..."
            style="width: 100%;"
          >
        </div>
        <table id="channel-table">
        <colgroup>
          <col style="width: 90%;">
          <col style="width: 10%; ">
        </colgroup>
          <thead>
            <tr>
              <th>채널 이름</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody id="channel-list">            
              <td colspan="3" style="padding: 20px; text-align: center; color: #999;">
                채널이 없습니다. 위에서 추가해보세요!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

setupChannelListHandlers(channelListContainer);
