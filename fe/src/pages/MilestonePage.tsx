import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Background } from "../components/common/Background";
import { useEffect, useState } from "react";
import { TabButton } from "../components/common/TabButton";
import { Button } from "../components/common/Button";
import { ColorScheme } from "../contexts/ThemeContext";
import { css, useTheme } from "@emotion/react";
import { tableHeaderStyle, tableStyle } from "../styles/commonStyles";
import { MilestoneElement } from "../components/Milestone/MilestoneElement";
import { LoadingBar } from "../components/common/LoadingBar";
import { MilestoneDetail } from "../components/Milestone/MilestoneDetail";
import { MainArea } from "../components/common/MainArea";

const TOTAL_COUNT_URL =
  "http://aed497a9-4c3a-45bf-91b8-433463633b2e.mock.pstmn.io/api/eojjeogojeojjeogo/common/navigation";
const MILESTONE_URL =
  "http://aed497a9-4c3a-45bf-91b8-433463633b2e.mock.pstmn.io/api/eojjeogojeojjeogo/milestones?filter=open";

type MilestonesData = {
  milestoneOpenedCount: number;
  milestoneClosedCount: number;
  milestones: {
    id: number;
    title: string;
    description: string;
    dueDay: string;
    issueClosedCount: number;
    issueOpenedCount: number;
  }[];
};

export type Milestone = MilestonesData["milestones"][0];

export type TotalCount = {
  labelsCount: number;
  milestonesCount: number;
};

const tableContainer = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  top: 24px;
`;

const milestoneTabContainer = css`
  display: flex;
  height: 32px;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
`;

export function MilestonePage() {
  const [totalCount, setTotalCount] = useState<TotalCount | undefined>();
  const [milestones, setMilestones] = useState<MilestonesData | undefined>();
  const [loading, setLoading] = useState(true);
  const [isLeftSelected, setIsLeftSelected] = useState(false);
  const [isOpenSelected, setIsOpenSelected] = useState(true);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);

  const navigate = useNavigate();
  const color = useTheme() as ColorScheme;
  const milestoneTable = tableStyle(color);
  const milestoneTableHeader = tableHeaderStyle(color);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const totalCountResponse = await fetch(TOTAL_COUNT_URL);
        const milestoneResponse = await fetch(MILESTONE_URL);
        const totalCountData = await totalCountResponse.json();
        const milestoneData = await milestoneResponse.json();

        setTotalCount(totalCountData);
        setMilestones(milestoneData);
        setLoading(false);
      } catch (error) {
        console.error("API 요청 중 에러 발생:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const AddMilestoneButtonStatus = isAddMilestoneOpen ? "disabled" : "enabled";

  const onClickLabelButton = () => {
    navigate("/label");
  };

  const onClickAddMilestoneButton = () => {
    setIsAddMilestoneOpen(true);
  };

  const onClickCompleteButton = () => {
    setIsAddMilestoneOpen(false);
  };
  const onClickCancelButton = () => {
    setIsAddMilestoneOpen(false);
  };

  const onClickLeftTab = () => {
    setIsLeftSelected(true);
    onClickLabelButton();
  };
  const onClickRightTab = () => {
    setIsLeftSelected(false);
  };

  const onClickOpenTab = () => {
    setIsOpenSelected(true);
  };
  const onClickClosedTab = () => {
    setIsOpenSelected(false);
  };

  const leftTabProps = {
    leftIcon: "label",
    leftText: "레이블" + `(${totalCount ? totalCount.labelsCount : ""})`,
    onClickLeftTab: onClickLeftTab,
  };
  const rightTabProps = {
    rightIcon: "milestone",
    rightText:
      "마일스톤" + `(${totalCount ? totalCount?.milestonesCount : ""})`,
    onClickRightTab: onClickRightTab,
  };

  if (loading) {
    return (
      <Background>
        <LoadingBar />
        <Header />
      </Background>
    );
  }

  return (
    <Background>
      <Header />
      <MainArea>
        <div css={{ display: "flex", justifyContent: "space-between" }}>
          <TabButton
            isLeftSelected={isLeftSelected}
            leftTabProps={leftTabProps}
            rightTabProps={rightTabProps}
          />
          <div className="addLabelButton" onClick={onClickAddMilestoneButton}>
            <Button
              status={AddMilestoneButtonStatus}
              type="contained"
              size="S"
              text="마일스톤 추가"
              icon="plus"
            />
          </div>
        </div>
        <div css={tableContainer}>
          {isAddMilestoneOpen ? (
            <MilestoneDetail
              mode="add"
              onClickCompleteButton={onClickCompleteButton}
              onClickCancelButton={onClickCancelButton}
            />
          ) : null}
          <div css={milestoneTable}>
            <div css={milestoneTableHeader}>
              <div css={{ display: "flex" }}>
                <div css={milestoneTabContainer}>
                  <Button
                    onClick={onClickOpenTab}
                    status={isOpenSelected ? "selected" : "enabled"}
                    icon="alertCircle"
                    type="ghost"
                    size="M"
                    text={`열린 마일스톤(${
                      milestones ? milestones.milestoneOpenedCount : ""
                    })`}
                  />
                  <Button
                    onClick={onClickClosedTab}
                    status={isOpenSelected ? "enabled" : "selected"}
                    icon="archive"
                    type="ghost"
                    size="M"
                    text={`닫힌 마일스톤(${
                      milestones ? milestones.milestoneClosedCount : ""
                    })`}
                  />
                </div>
              </div>
            </div>
            {milestones?.milestones.map((milestone) => (
              <MilestoneElement key={milestone.id} milestones={milestone} />
            ))}
          </div>
        </div>
      </MainArea>
    </Background>
  );
}