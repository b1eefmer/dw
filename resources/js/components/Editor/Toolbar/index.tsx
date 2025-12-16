import { Grid } from "@mui/material";
import pluginsList from "./toolbarIconsList";
import useOnClickListener from "./useOnClickListener";
import { createPortal } from "react-dom";
import FloatingLinkEditor from "./FloatingLinkEditor";

const Toolbar = () => {
    const { onClick, isLink, editor, modal } = useOnClickListener();
    return (
        <Grid container justifyContent={"space-between"} py={1} px={1}  >
            {pluginsList.map((plugin) => (
                <Grid item key={plugin.id}>
                    <plugin.Icon onClick={() => onClick(plugin.event)} />
                </Grid>
            ))}
            {isLink && 
                createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
            {modal}
        </Grid>
    );
};

export default Toolbar;