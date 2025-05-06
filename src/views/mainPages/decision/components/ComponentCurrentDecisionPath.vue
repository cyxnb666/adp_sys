<template>
  <div class="ComponentCurrentDecisionPath">
    <el-card class="head-card mt-15">
      <div slot="header" class="card-head-style1 clearfix">
        <span>{{ $t("decisionPath.decisionPath") }}</span>
      </div>
      <el-row class="content">
        <el-col
          :span="18"
          class="current-rule-wrapper"
          :style="{ height: showAllRule ? ruleHeight + 'px' : '80px' }"
        >
          <el-row ref="ruleContent" class="current-rule-content">
            <div class="item play">
              <img src="./../images/icon-play.png" alt="">
            </div>
            <div
              v-for="(item, index) in currentRuleList"
              :key="index"
              class="item"
              :class="{ active: index == isShow }"
              @click="changeColor(index)"
            >
              <h4>{{ item.name }}</h4>
              <h6>{{ item.value }}</h6>
            </div>
            <div class="item end">
              <div class="btn">
                <img class="icon" src="./../images/icon-set.png" alt="">
                {{ $t("decisionPath.setRule") }}
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div class="text-right">
            <el-button
              v-if="ruleHeight > 80"
              class="btn-border mini"
              @click="showAllRule = !showAllRule"
            >{{
              showAllRule
                ? $t("decisionPath.putAway")
                : $t("decisionPath.unfold")
            }}</el-button>
            <!-- <el-button
              class="btn-background"
              @click="isShowDialog=true"
            >创建规则流</el-button> -->
            <slot />
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- <el-dialog
      title="创建规则流"
      :visible.sync="isShowDialog"
      width="70%"
    >
      <div class="home" style="background-color: #fff;">
        <el-aside width="100px" style="border-right:1px solid #f5f7fa;text-align: center;padding:10px 100px 0;background-color:#eaf1ff;">
          <div class="process-component-list" style="display: flex;flex-direction: column;align-items: center;justify-content:center;">
            <img
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0ic3RhcnRfbm9kZSIgd2lkdGg9IjgwcHgiIGhlaWdodD0iODBweCIgdmlld0JveD0iMCAwIDgwIDgwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0OS4xICg1MTE0NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+R3JvdXAgMjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxjaXJjbGUgaWQ9InBhdGgtMSIgY3g9IjM2IiBjeT0iMzYiIHI9IjM2Ij48L2NpcmNsZT4KICAgICAgICA8ZmlsdGVyIHg9Ii05LjclIiB5PSItNi45JSIgd2lkdGg9IjExOS40JSIgaGVpZ2h0PSIxMTkuNCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0yIj4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMiIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSI+PC9mZU9mZnNldD4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb21wb3NpdGUgaW49InNoYWRvd0JsdXJPdXRlcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJvdXQiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbXBvc2l0ZT4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMDQgMCIgdHlwZT0ibWF0cml4IiBpbj0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWfuuehgOa1geeoi+Wbvi0wMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwNi4wMDAwMDAsIC05My4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMC4wMDAwMDAsIDk1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ik92YWwiPgogICAgICAgICAgICAgICAgICAgIDx1c2UgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsLW9wYWNpdHk9IjAuOTIiIGZpbGw9IiNGRkYyRTgiIGZpbGwtcnVsZT0iZXZlbm9kZCIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBzdHJva2U9IiNGRkMwNjkiIHN0cm9rZS13aWR0aD0iMSIgY3g9IjM2IiBjeT0iMzYiIHI9IjM1LjUiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPHRleHQgaWQ9IuW8gOWni+iKgueCuSIgZm9udC1mYW1pbHk9IlBpbmdGYW5nU0MtUmVndWxhciwgUGluZ0ZhbmcgU0MiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIGxpbmUtc3BhY2luZz0iMTIiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC42NSI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjEyIiB5PSI0MSI+5byA5aeL6IqC54K5PC90c3Bhbj4KICAgICAgICAgICAgICAgIDwvdGV4dD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
              data-type="node"
              data-shape="circle"
              data-size="72*72"
              data-color="#b1ddf0"
              data-label="开始"
            >
            <img
              draggable="false"
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iODhweCIgaGVpZ2h0PSI1NnB4IiB2aWV3Qm94PSIwIDAgODggNTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ5LjEgKDUxMTQ3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5Hcm91cDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTEiIHg9IjAiIHk9IjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0OCIgcng9IjQiPjwvcmVjdD4KICAgICAgICA8ZmlsdGVyIHg9Ii04LjglIiB5PSItMTAuNCUiIHdpZHRoPSIxMTcuNSUiIGhlaWdodD0iMTI5LjIlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItMiI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9IjIiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb21wb3NpdGU+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwICAgMCAwIDAgMCAwICAgMCAwIDAgMCAwICAwIDAgMCAwLjA0IDAiIHR5cGU9Im1hdHJpeCIgaW49InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb2xvck1hdHJpeD4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLln7rnoYDmtYHnqIvlm74tMDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02LjAwMDAwMCwgLTEwNS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC4wMDAwMDAsIDEwNy4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJSZWN0YW5nbGUtMTUtQ29weSI+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIxIiBmaWx0ZXI9InVybCgjZmlsdGVyLTIpIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8dXNlIGZpbGwtb3BhY2l0eT0iMC45MiIgZmlsbD0iI0U2RjdGRiIgZmlsbC1ydWxlPSJldmVub2RkIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBzdHJva2U9IiMxODkwRkYiIHN0cm9rZS13aWR0aD0iMSIgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI3OSIgaGVpZ2h0PSI0NyIgcng9IjQiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDx0ZXh0IGlkPSLlrqHmibnoioLngrkiIGZvbnQtZmFtaWx5PSJQaW5nRmFuZ1NDLVJlZ3VsYXIsIFBpbmdGYW5nIFNDIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0ibm9ybWFsIiBsaW5lLXNwYWNpbmc9IjEyIiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjAuNjUiPgogICAgICAgICAgICAgICAgICAgIDx0c3BhbiB4PSIxNiIgeT0iMjkiPuWuoeaJueiKgueCuTwvdHNwYW4+CiAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
              data-type="node"
              data-shape="rect"
              data-size="80*48"
              data-color="#b1ddf0"
              data-label="过程"
            >
            <img
              draggable="false"
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iODZweCIgaGVpZ2h0PSI3OHB4IiB2aWV3Qm94PSIwIDAgODYgNzgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ5LjEgKDUxMTQ3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5Hcm91cCAzPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTQyLjY3MDM3MjIsMS42Njk5NTcyOCBMNzcuNjM1MzAyNiwzMy4wMjE4OTQ1IEM3OS4yODAwNjQ4LDM0LjQ5NjcwMDMgNzkuNDE3ODQxNywzNy4wMjU2MDk5IDc3Ljk0MzAzNTksMzguNjcwMzcyMiBDNzcuODQ2MTE4NSwzOC43Nzg0NTgzIDc3Ljc0MzM4ODcsMzguODgxMTg4MSA3Ny42MzUzMDI2LDM4Ljk3ODEwNTUgTDQyLjY3MDM3MjIsNzAuMzMwMDQyNyBDNDEuMTUwODI4OSw3MS42OTI1Njg3IDM4Ljg0OTE3MTEsNzEuNjkyNTY4NyAzNy4zMjk2Mjc4LDcwLjMzMDA0MjcgTDIuMzY0Njk3NDQsMzguOTc4MTA1NSBDMC43MTk5MzUxODMsMzcuNTAzMjk5NyAwLjU4MjE1ODI3MiwzNC45NzQzOTAxIDIuMDU2OTY0MSwzMy4zMjk2Mjc4IEMyLjE1Mzg4MTUsMzMuMjIxNTQxNyAyLjI1NjYxMTI5LDMzLjExODgxMTkgMi4zNjQ2OTc0NCwzMy4wMjE4OTQ1IEwzNy4zMjk2Mjc4LDEuNjY5OTU3MjggQzM4Ljg0OTE3MTEsMC4zMDc0MzEzMDMgNDEuMTUwODI4OSwwLjMwNzQzMTMwMyA0Mi42NzAzNzIyLDEuNjY5OTU3MjggWiIgaWQ9InBhdGgtMSI+PC9wYXRoPgogICAgICAgIDxmaWx0ZXIgeD0iLTguOCUiIHk9Ii02LjklIiB3aWR0aD0iMTE3LjUlIiBoZWlnaHQ9IjExOS40JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTIiPgogICAgICAgICAgICA8ZmVPZmZzZXQgZHg9IjAiIGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIj48L2ZlT2Zmc2V0PgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyIiBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgICAgICAgIDxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93Qmx1ck91dGVyMSIgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9Im91dCIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlQ29tcG9zaXRlPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgIDAgMCAwIDAgMCAgMCAwIDAgMC4wNCAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5Z+656GA5rWB56iL5Zu+LTAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNy4wMDAwMDAsIC0xODQuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC4wMDAwMDAsIDE4NS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJQb2x5Z29uIj4KICAgICAgICAgICAgICAgICAgICA8dXNlIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjEiIGZpbHRlcj0idXJsKCNmaWx0ZXItMikiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDx1c2UgZmlsbC1vcGFjaXR5PSIwLjkyIiBmaWxsPSIjRTZGRkZCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIHN0cm9rZT0iIzVDREJEMyIgc3Ryb2tlLXdpZHRoPSIxIiBkPSJNNDIuMzM2NTc1NywyLjA0MjIyMDQ3IEM0MS4wMDY5NzUzLDAuODUwMDEwMjM5IDM4Ljk5MzAyNDcsMC44NTAwMTAyMzkgMzcuNjYzNDI0MywyLjA0MjIyMDQ3IEwyLjY5ODQ5Mzk2LDMzLjM5NDE1NzcgQzIuNjAzOTE4NTgsMzMuNDc4OTYwNCAyLjUxNDAzMDAyLDMzLjU2ODg0OSAyLjQyOTIyNzI5LDMzLjY2MzQyNDMgQzEuMTM4NzcyMTksMzUuMTAyNTkxMyAxLjI1OTMyNjk5LDM3LjMxNTM4NzIgMi42OTg0OTM5NiwzOC42MDU4NDIzIEwzNy42NjM0MjQzLDY5Ljk1Nzc3OTUgQzM4Ljk5MzAyNDcsNzEuMTQ5OTg5OCA0MS4wMDY5NzUzLDcxLjE0OTk4OTggNDIuMzM2NTc1Nyw2OS45NTc3Nzk1IEw3Ny4zMDE1MDYsMzguNjA1ODQyMyBDNzcuMzk2MDgxNCwzOC41MjEwMzk2IDc3LjQ4NTk3LDM4LjQzMTE1MSA3Ny41NzA3NzI3LDM4LjMzNjU3NTcgQzc4Ljg2MTIyNzgsMzYuODk3NDA4NyA3OC43NDA2NzMsMzQuNjg0NjEyOCA3Ny4zMDE1MDYsMzMuMzk0MTU3NyBMNDIuMzM2NTc1NywyLjA0MjIyMDQ3IFoiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDx0ZXh0IGlkPSLlpITnkIboioLngrkiIGZvbnQtZmFtaWx5PSJQaW5nRmFuZ1NDLVJlZ3VsYXIsIFBpbmdGYW5nIFNDIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0ibm9ybWFsIiBsaW5lLXNwYWNpbmc9IjEyIiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjAuNjUiPgogICAgICAgICAgICAgICAgICAgIDx0c3BhbiB4PSIxNiIgeT0iNDIiPuWkhOeQhuiKgueCuTwvdHNwYW4+CiAgICAgICAgICAgICAgICA8L3RleHQ+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
              data-type="node"
              data-shape="polygon"
              data-size="80*72"
              data-color="#b1ddf0"
              data-label="判断"
            >
            <img
              draggable="false"
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iODhweCIgaGVpZ2h0PSI1NnB4IiB2aWV3Qm94PSIwIDAgODggNTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ5LjEgKDUxMTQ3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5Hcm91cCA0PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHJlY3QgaWQ9InBhdGgtMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjQ4IiByeD0iMjQiPjwvcmVjdD4KICAgICAgICA8ZmlsdGVyIHg9Ii04LjglIiB5PSItMTAuNCUiIHdpZHRoPSIxMTcuNSUiIGhlaWdodD0iMTI5LjIlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItMiI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9IjIiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb21wb3NpdGU+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwICAgMCAwIDAgMCAwICAgMCAwIDAgMCAwICAwIDAgMCAwLjA0IDAiIHR5cGU9Im1hdHJpeCIgaW49InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb2xvck1hdHJpeD4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLln7rnoYDmtYHnqIvlm74tMDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDIuMDAwMDAwLCAtMTk1LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTA2LjAwMDAwMCwgMTk3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZS0xNS1Db3B5LTM1Ij4KICAgICAgICAgICAgICAgICAgICA8dXNlIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjEiIGZpbHRlcj0idXJsKCNmaWx0ZXItMikiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDx1c2UgZmlsbC1vcGFjaXR5PSIwLjkyIiBmaWxsPSIjRjlGMEZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDxyZWN0IHN0cm9rZT0iI0IzN0ZFQiIgc3Ryb2tlLXdpZHRoPSIxIiB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9Ijc5IiBoZWlnaHQ9IjQ3IiByeD0iMjMuNSI+PC9yZWN0PgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPHRleHQgaWQ9Iue7k+adn+iKgueCuSIgZm9udC1mYW1pbHk9IlBpbmdGYW5nU0MtUmVndWxhciwgUGluZ0ZhbmcgU0MiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIGxpbmUtc3BhY2luZz0iMTIiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC42NSI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjE2IiB5PSIyOSI+57uT5p2f6IqC54K5PC90c3Bhbj4KICAgICAgICAgICAgICAgIDwvdGV4dD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
              data-type="node"
              data-shape="ellipse"
              data-size="80*48"
              data-color="#b1ddf0"
              data-label="结束"
            >
          </div>
        </el-aside>
        <iframe ref="fIframe" src="./liuchengtu.html" width="79%" height="690px" style="margin-left:100px;padding-left:200px;background-color: #fff;border:0;" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="isShowDialog = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// import { Graph } from '@antv/x6'
// import Tools from './graphTool'
import { GetCurrentDecisionPath } from '@/api/mainPages/deci'
export default {
  name: 'ComponentCurrentDecisionPath',
  props: {
    decisionUrlId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showAllRule: false,
      currentRuleList: [], // 当前决策路径
      ruleHeight: 0, // 元素高度
      isShow: -1,
      isShowDialog: false,
      moduleList: [
        {
          id: 1,
          name: '开始模块',
          type: 'initial' // 初始模块(用于区分样式)
        },
        {
          id: 2,
          name: '结束模块',
          type: 'initial'
        },
        {
          id: 3,
          name: '逻辑模块1',
          type: 'logic' // 逻辑模块(用于区分样式)
        },
        {
          id: 4,
          name: '逻辑模块2',
          type: 'logic'
        }
      ], // 列表可拖动模块
      graph: null, // 画布实例对象
      curSelectNode: null // 当前选中的节点
    }
  },
  watch: {
    decisionUrlId(newValue, oldValue) {
      if (newValue) {
        this.GetCurrentDecisionPath(newValue)
      }
    }
  },
  // mounted() {
  //   this.initGraph()
  // },
  created() {
    if (this.decisionUrlId) {
      this.GetCurrentDecisionPath(this.decisionUrlId)
    }
  },
  methods: {
    // 初始化流程图画布
    // initGraph() {
    //   const container = document.getElementById('container')
    //   this.graph = new Graph({
    //     container: container, // 画布容器
    //     width: container.offsetWidth, // 画布宽
    //     height: container.offsetHeight, // 画布高
    //     background: false, // 背景（透明）
    //     snapline: true, // 对齐线
    //     // 配置连线规则
    //     connecting: {
    //       snap: true, // 自动吸附
    //       allowBlank: false, // 是否允许连接到画布空白位置的点
    //       allowMulti: false, // 是否允许在相同的起始节点和终止之间创建多条边
    //       allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
    //       highlight: true, // 拖动边时，是否高亮显示所有可用的节点
    //       validateEdge({ edge, type, previous }) {
    //         // 连线时设置折线
    //         edge.setRouter({
    //           name: 'er'
    //         })
    //         // 设置连线样式
    //         edge.setAttrs({
    //           line: {
    //             stroke: '#275da3',
    //             strokeWidth: 4
    //           }
    //         })
    //         return true
    //       }
    //     },
    //     panning: {
    //       enabled: true
    //     },
    //     mousewheel: {
    //       enabled: true // 支持滚动放大缩小
    //     },
    //     grid: {
    //       type: 'mesh',
    //       size: 20, // 网格大小 10px
    //       visible: true, // 渲染网格背景
    //       args: {
    //         color: '#eeeeee', // 网格线/点颜色
    //         thickness: 2 // 网格线宽度/网格点大小
    //       }
    //     }
    //   })

    //   this.nodeAddEvent()
    // },
    // 生成节点函数
    // addHandleNode(x, y, id, name, type) {
    //   type === 'initial'
    //     ? this.graph.addNode(Tools.initInitialNode(x, y, id, name, type))
    //     : this.graph.addNode(Tools.initLogicNode(x, y, id, name, type))
    // },
    // nodeAddEvent() {
    //   // 节点绑定点击事件
    //   this.graph.on('node:click', ({ e, x, y, node, view }) => {
    //     // 判断是否有选中过节点
    //     if (this.curSelectNode) {
    //       // 移除选中状态
    //       this.curSelectNode.removeTools()
    //       // 判断两次选中节点是否相同
    //       if (this.curSelectNode !== node) {
    //         node.addTools([{
    //           name: 'boundary',
    //           args: {
    //             attrs: {
    //               fill: '#16B8AA',
    //               stroke: '#2F80EB',
    //               strokeWidth: 1,
    //               fillOpacity: 0.1
    //             }
    //           }
    //         }, {
    //           name: 'button-remove',
    //           args: {
    //             x: '100%',
    //             y: 0,
    //             offset: {
    //               x: 0,
    //               y: 0
    //             }
    //           }
    //         }])
    //         this.curSelectNode = node
    //       } else {
    //         this.curSelectNode = null
    //       }
    //     } else {
    //       this.curSelectNode = node
    //       node.addTools([{
    //         name: 'boundary',
    //         args: {
    //           attrs: {
    //             fill: '#16B8AA',
    //             stroke: '#2F80EB',
    //             strokeWidth: 1,
    //             fillOpacity: 0.1
    //           }
    //         }
    //       }, {
    //         name: 'button-remove',
    //         args: {
    //           x: '100%',
    //           y: 0,
    //           offset: {
    //             x: 0,
    //             y: 0
    //           }
    //         }
    //       }])
    //     }
    //   })
    //   // 连线绑定悬浮事件
    //   this.graph.on('cell:mouseenter', ({ cell }) => {
    //     if (cell.shape === 'edge') {
    //       cell.addTools([
    //         {
    //           name: 'button-remove',
    //           args: {
    //             x: '100%',
    //             y: 0,
    //             offset: {
    //               x: 0,
    //               y: 0
    //             }
    //           }
    //         }])
    //       cell.setAttrs({
    //         line: {
    //           stroke: '#409EFF'
    //         }
    //       })
    //       cell.zIndex = 99
    //     }
    //   })
    //   this.graph.on('cell:mouseleave', ({ cell }) => {
    //     if (cell.shape === 'edge') {
    //       cell.removeTools()
    //       cell.setAttrs({
    //         line: {
    //           stroke: '#275da3'
    //         }
    //       })
    //       cell.zIndex = 1
    //     }
    //   })
    // },
    // 拖动后松开鼠标触发事件
    // handleDragEnd(e, item) {
    //   this.addHandleNode(e.pageX - 240, e.pageY - 40, new Date().getTime(), item.name, item.type)
    // },
    // 拖动节点到画布中鼠标样式变为可拖动状态
    // dragoverDiv(ev) {
    //   ev.preventDefault()
    // },
    changeColor(index) {
      this.isShow = index
    },
    GetCurrentDecisionPath(id) {
      const data = {
        decisionUrlId: id,
        applicationId: this.$store.state.app.applicationId
      }
      GetCurrentDecisionPath(data).then(res => {
        this.$nextTick(() => {
          this.ruleHeight = this.$refs.ruleContent?.$el.clientHeight
        })
        this.currentRuleList = res.map(item => {
          return {
            name: item.decisionNodeFieldName,
            value: item.nodeFieldValue
          }
        })
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.active {
  background-color: #eaf1ff;
  border: 1px solid #33bbff !important;
}
.home {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  background: #eaeaea;
  > div {
    background: #ffffff;
    border-radius: 5px;
  }
  // 模块列表部分
  .menu-bar {
    width: 200px;
    height: 100%;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    h2 {
      width: 100%;
      font-size: 20px;
      padding: 10px;
      box-sizing: border-box;
      margin: 0;
    }
    .menu-list {
      height: 0;
      flex: 1;
      overflow: auto;
      padding: 0 10px;
      box-sizing: border-box;
      > div {
        border: 2px dashed #eaeaea;
        margin-bottom: 10px;
        border-radius: 5px;
        padding: 0 10px;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }
  // 画布部分
  .canvas-card {
    width: 0;
    height: 390px!important;
    flex: 1;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    > div {
      width: 100%;
      height: 100%;
      border: 2px dashed #eaeaea;
    }
  }
}
</style>
<style lang="scss">
// 其中节点样式加到没有scoped包裹的style标签中，否则样式不生效
// 初始节点样式
.custom_node_initial {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 3px;
  background: rgba(22, 184, 169, 0.6);
  flex-direction: column;
  overflow: hidden;
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    box-sizing: border-box;
    border: 5px solid rgba(47, 128, 235, 0.6);
    i {
      line-height: 22px;
      font-size: 18px;
      color: #ffffff;
      display: flex;
      align-items: center;
      margin-right: 5px;
      justify-content: center;
      font-style: normal;
    }
    p {
      color: #ffffff;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
// 逻辑节点样式
.custom_node_logic {
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(47, 128, 235, 0.5);
  flex-direction: column;
  overflow: hidden;
  border-radius: 5px;
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    box-sizing: border-box;
    border: 5px solid rgba(22, 184, 169, 0.5);
    border-radius: 5px;
    line-height: 22px;
    i {
      line-height: 22px;
      font-size: 18px;
      color: #b5cde9;
      margin-right: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-style: normal;
    }
    p {
      color: #ffffff;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

    }
  }
}
</style>
