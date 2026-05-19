import { useState } from 'react';
import './App.css';

import BaseButton from './components/common/BaseButton';
import InputField from './components/common/InputField';
import BaseModal from './components/common/BaseModal';

function App() {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div style={{ padding: 24 }}>
        <h1>컴포넌트 테스트</h1>

        <div style={{ margin: '16px 0' }}>
          <BaseButton onClick={() => alert('BaseButton 클릭')}>기본 버튼</BaseButton>
          <BaseButton variant="secondary" className="ml-2">Secondary</BaseButton>
          <BaseButton loading className="ml-2">로딩</BaseButton>
        </div>

        <div style={{ margin: '16px 0', maxWidth: 420 }}>
          <InputField
            label="이름"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="이름 입력"
            required
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <BaseButton onClick={() => setIsOpen(true)}>모달 열기</BaseButton>
        </div>

        <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="테스트 모달">
          <p>입력값: {value}</p>
          <div style={{ marginTop: 12 }}>
            <BaseButton onClick={() => setIsOpen(false)}>닫기</BaseButton>
          </div>
        </BaseModal>
      </div>
    </>
  );
}

export default App;
